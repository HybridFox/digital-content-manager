use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;

use crate::modules::users::models::user::User;
use crate::modules::sites::models::site::Site;

use crate::errors::AppError;
use crate::schema::sites_users;

#[derive(Identifiable, Selectable, Queryable, Associations, Debug)]
#[diesel(belongs_to(User))]
#[diesel(belongs_to(Site))]
#[diesel(table_name = sites_users)]
#[diesel(primary_key(user_id, site_id))]
pub struct SiteUser {
	pub user_id: Uuid,
	pub site_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl SiteUser {
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		user_id: Uuid,
	) -> Result<Vec<Self>, AppError> {
		let permissions_iam_actions = diesel::insert_into(sites_users::table)
			.values(CreateSiteUser { user_id, site_id })
			.returning(SiteUser::as_returning())
			.get_results(conn)?;

		Ok(permissions_iam_actions)
	}

	pub fn upsert(conn: &mut PgConnection, site_id: Uuid, user_id: Uuid) -> Result<(), AppError> {
		diesel::insert_into(sites_users::table)
			.values(CreateSiteUser { user_id, site_id })
			.on_conflict((sites_users::user_id, sites_users::site_id))
			.do_nothing()
			.returning(SiteUser::as_returning())
			.get_results(conn)?;

		Ok(())
	}

	pub fn remove(conn: &mut PgConnection, site_id: Uuid, user_id: Uuid) -> Result<(), AppError> {
		let target = sites_users::table
			.filter(sites_users::user_id.eq(user_id))
			.filter(sites_users::site_id.eq(site_id));
		diesel::delete(target).execute(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = sites_users)]
pub struct CreateSiteUser {
	pub user_id: Uuid,
	pub site_id: Uuid,
}
