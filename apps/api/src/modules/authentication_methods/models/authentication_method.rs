use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use serde_json::Value;
use uuid::Uuid;
use tracing::instrument;

use crate::errors::AppError;
use crate::schema::authentication_methods;

#[derive(Identifiable, Selectable, Queryable, Debug, Clone)]
#[diesel(table_name = authentication_methods)]
#[diesel(primary_key(id))]
pub struct AuthenticationMethod {
	pub id: Uuid,
	pub name: String,
	pub kind: String,
	pub configuration: Option<Value>,
	pub weight: i32,
	pub active: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl AuthenticationMethod {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		authentication_method: CreateAuthenticationMethod
	) -> Result<
		Self,
		AppError,
	> {
		let created_authentication_method = diesel::insert_into(authentication_methods::table)
			.values(authentication_method)
			.returning(AuthenticationMethod::as_returning())
			.get_result(conn)?;

		Ok(created_authentication_method)
	}

	#[instrument(skip(conn))]
	pub fn find_one(
		conn: &mut PgConnection,
		id: Uuid,
	) -> Result<
		Self,
		AppError,
	> {
		let authentication_method = authentication_methods::table.find(id).first::<Self>(conn)?;

		Ok(authentication_method)
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		page: i64,
		pagesize: i64,
	) -> Result<
		(
			Vec<Self>,
			i64,
		),
		AppError,
	> {
		let query = {
			let mut query = authentication_methods::table
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let authentication_methods = query.select(AuthenticationMethod::as_select()).load::<AuthenticationMethod>(conn)?;
		let total_elements = authentication_methods::table
			.count()
			.get_result::<i64>(conn)?;

		Ok((authentication_methods, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		id: Uuid,
		changeset: UpdateAuthenticationMethod,
	) -> Result<
		Self,
		AppError,
	> {
		let target = authentication_methods::table.find(id);
		let updated_authentication_method = diesel::update(target)
			.set(changeset)
			.returning(Self::as_returning())
			.get_result::<Self>(conn)?;

		Ok(updated_authentication_method)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_id: Uuid) -> Result<(), AppError> {
		diesel::delete(authentication_methods::table.filter(authentication_methods::id.eq(content_id)))
			.get_result::<AuthenticationMethod>(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = authentication_methods)]
pub struct CreateAuthenticationMethod {
	pub name: String,
	pub kind: String,
	pub weight: i32,
	pub configuration: Option<Value>,
	pub active: bool,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = authentication_methods)]
pub struct UpdateAuthenticationMethod {
	pub name: String,
	pub weight: i32,
	pub configuration: Option<Value>,
	pub active: bool,
}
