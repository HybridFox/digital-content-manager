use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;
use tracing::instrument;

use crate::errors::AppError;
use crate::modules::roles::models::role::Role;
use crate::modules::sites::models::site::Site;
use crate::schema::{authentication_method_roles, roles, sites};

#[derive(Identifiable, Selectable, Queryable, Debug, Clone)]
#[diesel(table_name = authentication_method_roles)]
#[diesel(primary_key(id))]
pub struct AuthenticationMethodRole {
	pub id: Uuid,
	pub authentication_method_id: Uuid,
	pub site_id: Option<Uuid>,
	pub role_id: Uuid,
}

impl AuthenticationMethodRole {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		authentication_method: CreateAuthenticationMethodRole,
	) -> Result<(Self, Role, Option<Site>), AppError> {
		let created_authentication_method = diesel::insert_into(authentication_method_roles::table)
			.values(authentication_method)
			.returning(AuthenticationMethodRole::as_returning())
			.get_result(conn)?;

		Ok(Self::find_one(conn, created_authentication_method.id)?)
	}

	#[instrument(skip(conn))]
	pub fn find_one(
		conn: &mut PgConnection,
		id: Uuid,
	) -> Result<(Self, Role, Option<Site>), AppError> {
		let authentication_method = authentication_method_roles::table
			.find(id)
			.inner_join(roles::table.on(roles::id.eq(authentication_method_roles::role_id)))
			.left_join(
				sites::table
					.on(sites::id.eq(authentication_method_roles::site_id.assume_not_null())),
			)
			.select((
				Self::as_select(),
				Role::as_select(),
				Option::<Site>::as_select(),
			))
			.get_result::<(Self, Role, Option<Site>)>(conn)?;

		Ok(authentication_method)
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		authentication_method_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<(Self, Role, Option<Site>)>, i64), AppError> {
		let query = {
			let mut query = authentication_method_roles::table
				.filter(
					authentication_method_roles::authentication_method_id
						.eq(authentication_method_id),
				)
				.inner_join(roles::table.on(roles::id.eq(authentication_method_roles::role_id)))
				.left_join(
					sites::table
						.on(sites::id.eq(authentication_method_roles::site_id.assume_not_null())),
				)
				.select((
					Self::as_select(),
					Role::as_select(),
					Option::<Site>::as_select(),
				))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let authentication_method_roles =
			query.load::<(AuthenticationMethodRole, Role, Option<Site>)>(conn)?;
		let total_elements = authentication_method_roles::table
			.count()
			.get_result::<i64>(conn)?;

		Ok((authentication_method_roles, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		id: Uuid,
		changeset: UpdateAuthenticationMethodRole,
	) -> Result<(Self, Role, Option<Site>), AppError> {
		let target = authentication_method_roles::table.find(id);
		let updated_authentication_method = diesel::update(target)
			.set(changeset)
			.returning(Self::as_returning())
			.get_result::<Self>(conn)?;

		Ok(Self::find_one(conn, updated_authentication_method.id)?)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_id: Uuid) -> Result<(), AppError> {
		diesel::delete(
			authentication_method_roles::table
				.filter(authentication_method_roles::id.eq(content_id)),
		)
		.get_result::<AuthenticationMethodRole>(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = authentication_method_roles)]
pub struct CreateAuthenticationMethodRole {
	pub authentication_method_id: Uuid,
	pub role_id: Uuid,
	pub site_id: Option<Uuid>,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = authentication_method_roles)]
pub struct UpdateAuthenticationMethodRole {
	pub role_id: Uuid,
}
