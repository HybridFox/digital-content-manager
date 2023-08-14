use crate::errors::{AppError, AppErrorValue};
use crate::modules::iam_policies::models::iam_policy::IAMPolicy;
use crate::modules::iam_policies::models::permission::Permission;
use crate::modules::iam_policies::models::permission_iam_action::PermissionIAMAction;
use crate::modules::iam_policies::models::roles_iam_policies::RoleIAMPolicy;
use crate::modules::roles::models::role::Role;
use crate::modules::languages::models::language::Language;
use crate::modules::sites::models::site::Site;
use crate::modules::sites::models::site_language::SiteLanguage;
use crate::modules::sites::models::site_user::SiteUser;
use crate::modules::sites::models::site_user_role::SiteUserRole;
use crate::modules::users::models::user_role::UserRole;
use crate::schema::{
	users, sites, sites_users, roles, sites_users_roles, roles_iam_policies, iam_policies,
	sites_languages, languages, users_roles,
};
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
	pub avatar: Option<String>,
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
		avatar: Option<&'a str>,
		source: Option<&'a str>,
	) -> Result<(User, Token), AppError> {
		use diesel::prelude::*;
		let hashed_password = hasher::hash_password(naive_password)?;

		let record = SignupUser {
			email,
			name,
			password: &hashed_password,
			avatar,
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

	pub fn find_one(conn: &mut PgConnection, id: Uuid) -> Result<Self, AppError> {
		let t = users::table.find(id);
		let user = t.first(conn)?;

		Ok(user)
	}

	pub fn total_count(conn: &mut PgConnection) -> Result<i64, AppError> {
		let count = users::table.count().get_result::<i64>(conn)?;

		Ok(count)
	}

	pub fn find_one_with_roles_in_site(
		conn: &mut PgConnection,
		site_id: Uuid,
		id: Uuid,
	) -> Result<(Self, Vec<Role>), AppError> {
		let users: Vec<Self> = users::table.find(id).load::<Self>(conn)?;

		let roles = SiteUserRole::belonging_to(&users)
			.inner_join(roles::table.on(roles::id.eq(sites_users_roles::role_id)))
			.filter(sites_users_roles::site_id.eq(site_id))
			.select(Role::as_select())
			.load::<Role>(conn)?;

		// TODO: fix this
		Ok((users.first().unwrap().to_owned(), roles))
	}

	pub fn find_one_with_roles(
		conn: &mut PgConnection,
		id: Uuid,
	) -> Result<(Self, Vec<Role>), AppError> {
		let user: Self = users::table.find(id).get_result::<Self>(conn)?;

		let roles = UserRole::belonging_to(&user)
			.inner_join(roles::table.on(roles::id.eq(users_roles::role_id)))
			.select(Role::as_select())
			.load::<Role>(conn)?;

		Ok((user, roles))
	}

	pub fn find_in_site(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<(Self, Vec<Role>)>, i64), AppError> {
		let query = {
			let mut query = users::table
				.inner_join(sites_users::table.on(sites_users::user_id.eq(users::id)))
				.filter(sites_users::site_id.eq(site_id))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let users = query.select(Self::as_select()).load::<Self>(conn)?;

		let roles: Vec<(SiteUserRole, Role)> = SiteUserRole::belonging_to(&users)
			.inner_join(roles::table.on(roles::id.eq(sites_users_roles::role_id)))
			.filter(sites_users_roles::site_id.eq(site_id))
			.select((SiteUserRole::as_select(), Role::as_select()))
			.load::<(SiteUserRole, Role)>(conn)?;
		let grouped_roles = roles.grouped_by(&users);
		let users_with_roles = users
			.into_iter()
			.zip(grouped_roles)
			.map(|(user, roles)| {
				let only_roles = roles
					.into_iter()
					.map(|(_site_user_role, role)| role)
					.collect::<Vec<Role>>();

				(user, only_roles)
			})
			.collect::<Vec<(Self, Vec<Role>)>>();

		let total_elements = users::table
			.inner_join(sites_users::table.on(sites_users::user_id.eq(users::id)))
			.filter(sites_users::site_id.eq(site_id))
			.count()
			.get_result::<i64>(conn)?;

		Ok((users_with_roles, total_elements))
	}

	pub fn find(
		conn: &mut PgConnection,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<(Self, Vec<Role>)>, i64), AppError> {
		let query = {
			let mut query = users::table
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let users = query.select(Self::as_select()).load::<Self>(conn)?;

		let roles: Vec<(UserRole, Role)> = UserRole::belonging_to(&users)
			.inner_join(roles::table.on(roles::id.eq(users_roles::role_id)))
			.select((UserRole::as_select(), Role::as_select()))
			.load::<(UserRole, Role)>(conn)?;
		let grouped_roles = roles.grouped_by(&users);
		let users_with_roles = users
			.into_iter()
			.zip(grouped_roles)
			.map(|(user, roles)| {
				let only_roles = roles
					.into_iter()
					.map(|(_site_user_role, role)| role)
					.collect::<Vec<Role>>();

				(user, only_roles)
			})
			.collect::<Vec<(Self, Vec<Role>)>>();

		let total_elements = users::table
			.count()
			.get_result::<i64>(conn)?;

		Ok((users_with_roles, total_elements))
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

impl User {
	pub fn get_sites(
		&self,
		conn: &mut PgConnection,
	) -> Result<
		Vec<(
			Site,
			Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)>,
			Vec<Language>,
		)>,
		AppError,
	> {
		// TODO: Clean this up?
		let sites = SiteUser::belonging_to(self)
			.inner_join(sites::table.on(sites::id.eq(sites_users::site_id)))
			.select(Site::as_select())
			.load::<Site>(conn)?;

		let roles = SiteUserRole::belonging_to(self)
			.inner_join(roles::table.on(roles::id.eq(sites_users_roles::role_id)))
			.select(Role::as_select())
			.load::<Role>(conn)?;

		let languages = SiteLanguage::belonging_to(&sites)
			.inner_join(languages::table.on(languages::id.eq(sites_languages::language_id)))
			.select((SiteLanguage::as_select(), Language::as_select()))
			.load::<(SiteLanguage, Language)>(conn)?;
		let grouped_languages = languages.grouped_by(&sites);

		let iam_policies = RoleIAMPolicy::belonging_to(&roles)
			.inner_join(
				iam_policies::table.on(iam_policies::id.eq(roles_iam_policies::iam_policy_id)),
			)
			.select((RoleIAMPolicy::as_select(), IAMPolicy::as_select()))
			.load::<(RoleIAMPolicy, IAMPolicy)>(conn)?;

		let permissions = Permission::belonging_to(
			&iam_policies
				.iter()
				.map(|(_, policy)| policy.to_owned())
				.collect::<Vec<IAMPolicy>>(),
		)
		.select(Permission::as_select())
		.load(conn)?;

		let actions = PermissionIAMAction::belonging_to(&permissions)
			.select(PermissionIAMAction::as_select())
			.load::<PermissionIAMAction>(conn)?;

		let permissions_with_actions: Vec<(Permission, Vec<String>)> = actions
			.grouped_by(&permissions)
			.into_iter()
			.zip(permissions)
			.map(|(actions, permission)| {
				(
					permission,
					actions
						.into_iter()
						.map(|action| action.iam_action_key)
						.collect::<Vec<String>>(),
				)
			})
			.collect();

		let policies_with_permissions: Vec<(
			RoleIAMPolicy,
			IAMPolicy,
			Vec<(Permission, Vec<String>)>,
		)> = iam_policies
			.into_iter()
			.map(|(role_iam_policy, iam_policy)| {
				let permissions = &permissions_with_actions
					.iter()
					.filter(|(permission, _)| permission.iam_policy_id == iam_policy.id)
					.map(|vec| vec.to_owned())
					.collect::<Vec<(Permission, Vec<String>)>>();
				(
					role_iam_policy,
					iam_policy.to_owned(),
					permissions.to_owned(),
				)
			})
			.collect();

		let roles_with_iam_policies: Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)> =
			roles
				.into_iter()
				.map(|role| {
					let policies = &policies_with_permissions
						.iter()
						.filter(|(role_iam_policy, _, _)| role_iam_policy.role_id == role.id)
						.map(|(_, iam_policy, permissions)| {
							(iam_policy.to_owned(), permissions.to_owned())
						})
						.collect::<Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>>();
					(role.to_owned(), policies.to_owned())
				})
				.collect();

		let sites_with_roles: Vec<(
			Site,
			Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)>,
			Vec<Language>,
		)> = sites
			.into_iter()
			.zip(grouped_languages)
			.map(|(site, languages)| {
				let roles = &roles_with_iam_policies
					.iter()
					.filter(|(role, _)| role.site_id == Some(site.id))
					.map(|vec| vec.to_owned())
					.collect::<Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)>>();
				let langs = languages
					.iter()
					.map(|(_site_language, language)| language.to_owned())
					.collect::<Vec<Language>>();

				(site.to_owned(), roles.to_owned(), langs)
			})
			.collect();

		Ok(sites_with_roles)
	}

	pub fn get_roles(
		&self,
		conn: &mut PgConnection,
	) -> Result<
		Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)>,
		AppError,
	> {
		let roles = UserRole::belonging_to(self)
			.inner_join(roles::table.on(roles::id.eq(users_roles::role_id)))
			.select(Role::as_select())
			.load::<Role>(conn)?;

		let iam_policies = RoleIAMPolicy::belonging_to(&roles)
			.inner_join(
				iam_policies::table.on(iam_policies::id.eq(roles_iam_policies::iam_policy_id)),
			)
			.select((RoleIAMPolicy::as_select(), IAMPolicy::as_select()))
			.load::<(RoleIAMPolicy, IAMPolicy)>(conn)?;

		let permissions = Permission::belonging_to(
			&iam_policies
				.iter()
				.map(|(_, policy)| policy.to_owned())
				.collect::<Vec<IAMPolicy>>(),
		)
		.select(Permission::as_select())
		.load(conn)?;

		let actions = PermissionIAMAction::belonging_to(&permissions)
			.select(PermissionIAMAction::as_select())
			.load::<PermissionIAMAction>(conn)?;

		let permissions_with_actions: Vec<(Permission, Vec<String>)> = actions
			.grouped_by(&permissions)
			.into_iter()
			.zip(permissions)
			.map(|(actions, permission)| {
				(
					permission,
					actions
						.into_iter()
						.map(|action| action.iam_action_key)
						.collect::<Vec<String>>(),
				)
			})
			.collect();

		let policies_with_permissions: Vec<(
			RoleIAMPolicy,
			IAMPolicy,
			Vec<(Permission, Vec<String>)>,
		)> = iam_policies
			.into_iter()
			.map(|(role_iam_policy, iam_policy)| {
				let permissions = &permissions_with_actions
					.iter()
					.filter(|(permission, _)| permission.iam_policy_id == iam_policy.id)
					.map(|vec| vec.to_owned())
					.collect::<Vec<(Permission, Vec<String>)>>();
				(
					role_iam_policy,
					iam_policy.to_owned(),
					permissions.to_owned(),
				)
			})
			.collect();

		let roles_with_iam_policies: Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)> =
			roles
				.into_iter()
				.map(|role| {
					let policies = &policies_with_permissions
						.iter()
						.filter(|(role_iam_policy, _, _)| role_iam_policy.role_id == role.id)
						.map(|(_, iam_policy, permissions)| {
							(iam_policy.to_owned(), permissions.to_owned())
						})
						.collect::<Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>>();
					(role.to_owned(), policies.to_owned())
				})
				.collect();

		Ok(roles_with_iam_policies)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = users)]
pub struct SignupUser<'a> {
	pub email: &'a str,
	pub name: &'a str,
	pub password: &'a str,
	pub avatar: Option<&'a str>,
	pub source: Option<&'a str>,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = users)]
pub struct UpdateUser {
	pub email: Option<String>,
	pub name: Option<String>,
	pub password: Option<String>,
	pub avatar: Option<String>,
	pub bio: Option<String>,
}
