use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;

use crate::modules::users::models::user::User;
use crate::modules::sites::models::site::Site;
use crate::modules::roles::models::role::Role;

use crate::errors::AppError;
use crate::schema::sites_users_roles;

#[derive(Identifiable, Selectable, Queryable, Associations, Debug)]
#[diesel(belongs_to(User))]
#[diesel(belongs_to(Site))]
#[diesel(belongs_to(Role))]
#[diesel(table_name = sites_users_roles)]
#[diesel(primary_key(user_id, site_id, role_id))]
pub struct SiteUserRole {
	pub user_id: Uuid,
	pub site_id: Uuid,
	pub role_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl SiteUserRole {
	pub fn create(
		conn: &mut PgConnection,
		user_id: Uuid,
		site_id: Uuid,
		role_id: Uuid,
	) -> Result<Vec<Self>, AppError> {
		let permissions_iam_actions = diesel::insert_into(sites_users_roles::table)
			.values(CreateSiteUserRole {
				user_id,
				site_id,
				role_id,
			})
			.returning(SiteUserRole::as_returning())
			.get_results(conn)?;

		Ok(permissions_iam_actions)
	}

	pub fn upsert_many(
		conn: &mut PgConnection,
		site_id: Uuid,
		user_id: Uuid,
		role_ids: Vec<Uuid>,
	) -> Result<Vec<Self>, AppError> {
		let target = sites_users_roles::table
			.filter(sites_users_roles::site_id.eq(site_id))
			.filter(sites_users_roles::user_id.eq(user_id));
		diesel::delete(target).execute(conn)?;

		let insert_items: Vec<CreateSiteUserRole> = role_ids
			.into_iter()
			.map(|role_id| CreateSiteUserRole {
				user_id,
				site_id,
				role_id,
			})
			.collect();

		let permissions_iam_actions = diesel::insert_into(sites_users_roles::table)
			.values(insert_items)
			.returning(SiteUserRole::as_returning())
			.get_results(conn)?;

		Ok(permissions_iam_actions)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = sites_users_roles)]
pub struct CreateSiteUserRole {
	pub user_id: Uuid,
	pub site_id: Uuid,
	pub role_id: Uuid,
}
