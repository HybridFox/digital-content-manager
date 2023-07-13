// use crate::app::favorite::model::Favorite;
// use crate::app::follow::model::{CreateFollow, DeleteFollow, Follow};
// use crate::app::profile::model::Profile;
use crate::errors::{AppError, AppErrorValue};
use crate::schema::users;
use crate::utils::{hasher, token};
use actix_web::http::StatusCode;
use chrono::prelude::*;
use chrono::NaiveDateTime;
use diesel::backend::Backend;
use diesel::dsl::{AsSelect, Eq, Filter, Select};
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use tracing::instrument;
use uuid::Uuid;

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
	pub id: Uuid,
	pub email: String,
	pub name: String,
	pub password: String,
	pub source: String,
	pub bio: Option<String>,
	pub image: Option<String>,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

type Token = String;

type All<DB> = Select<users::table, AsSelect<User, DB>>;
type WithName<T> = Eq<users::name, T>;
type ByUsername<DB, T> = Filter<All<DB>, WithName<T>>;

impl User {
	fn all<DB>() -> All<DB>
	where
		DB: Backend,
	{
		users::table.select(User::as_select())
	}

	pub fn with_name(name: &str) -> WithName<&str> {
		users::name.eq(name)
	}

	fn by_name<DB>(name: &str) -> ByUsername<DB, &str>
	where
		DB: Backend,
	{
		Self::all().filter(Self::with_name(name))
	}

	fn find_by_email_and_source(
		conn: &mut PgConnection,
		email: &str,
		source: &str,
	) -> Result<Option<User>, diesel::result::Error> {
		users::table
			.select(User::as_select())
			.filter(users::email.eq(email))
			.filter(users::source.eq(source))
			.limit(1)
			.first(conn)
			.optional()
	}
}

impl User {
	#[instrument(skip(conn, naive_password))]
	pub fn signup<'a>(
		conn: &mut PgConnection,
		email: &'a str,
		name: &'a str,
		naive_password: &'a str,
		image: Option<&'a str>,
		source: Option<&'a str>,
	) -> Result<(User, Token), AppError> {
		use diesel::prelude::*;
		let hashed_password = hasher::hash_password(naive_password)?;

		let record = SignupUser {
			email,
			name,
			password: &hashed_password,
			image,
			source,
		};

		let user = diesel::insert_into(users::table)
			.values(&record)
			.returning(User::as_returning())
			.get_result::<User>(conn)?;

		let token = user.generate_token()?;
		Ok((user, token))
	}

	#[instrument(skip(conn, naive_password))]
	pub fn signin_local(
		conn: &mut PgConnection,
		email: &str,
		naive_password: &str,
	) -> Result<(User, Token), AppError> {
		let user = Self::find_by_email_and_source(conn, email, "local")?;

		match user {
			None => Err(AppError::Unauthorized(AppErrorValue {
				message: "Username or password incorrect".to_owned(),
				status: StatusCode::UNAUTHORIZED.as_u16(),
				code: "LOGIN_FAILED".to_owned(),
				..Default::default()
			})),
			Some(user) => {
				let password_correct = hasher::verify(naive_password, &user.password)?;

				if !password_correct {
					return Err(AppError::Unauthorized(AppErrorValue {
						message: "Username or password incorrect".to_owned(),
						status: StatusCode::UNAUTHORIZED.as_u16(),
						code: "LOGIN_FAILED".to_owned(),
						..Default::default()
					}));
				}

				let token = user.generate_token()?;
				Ok((user, token))
			}
		}
	}

	#[instrument(skip(conn))]
	pub fn signin_social(
		conn: &mut PgConnection,
		email: &str,
		source: &str,
	) -> Result<(User, Token), AppError> {
		let user = Self::find_by_email_and_source(conn, email, source)?;

		match user {
			None => Err(AppError::NotFound(AppErrorValue {
				message: "Username or password incorrect".to_owned(),
				status: StatusCode::UNAUTHORIZED.as_u16(),
				code: "LOGIN_FAILED".to_owned(),
				..Default::default()
			})),
			Some(user) => {
				let token = user.generate_token()?;
				Ok((user, token))
			}
		}
	}

	pub fn find(conn: &mut PgConnection, id: Uuid) -> Result<Self, AppError> {
		let t = users::table.find(id);
		let user = t.first(conn)?;
		Ok(user)
	}

	pub fn update(
		conn: &mut PgConnection,
		user_id: Uuid,
		changeset: UpdateUser,
	) -> Result<Self, AppError> {
		let target = users::table.find(user_id);
		let user = diesel::update(target)
			.set(changeset)
			.get_result::<User>(conn)?;
		Ok(user)
	}

	pub fn find_by_username(conn: &mut PgConnection, name: &str) -> Result<Self, AppError> {
		let t = Self::by_name(name).limit(1);
		let user = t.first::<User>(conn)?;
		Ok(user)
	}
}

impl User {
	pub fn generate_token(&self) -> Result<String, AppError> {
		let now = Utc::now().timestamp_nanos() / 1_000_000_000; // nanosecond -> second
		let token = token::generate(self.id, now)?;
		Ok(token)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = users)]
pub struct SignupUser<'a> {
	pub email: &'a str,
	pub name: &'a str,
	pub password: &'a str,
	pub image: Option<&'a str>,
	pub source: Option<&'a str>,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = users)]
pub struct UpdateUser {
	pub email: Option<String>,
	pub name: Option<String>,
	pub password: Option<String>,
	pub image: Option<String>,
	pub bio: Option<String>,
}
