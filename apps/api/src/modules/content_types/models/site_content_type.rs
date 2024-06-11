use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use tracing::instrument;
use uuid::Uuid;

use crate::modules::content_types::models::content_type::ContentType;
use crate::modules::sites::models::site::Site;

use crate::errors::AppError;
use crate::schema::sites_content_types;

#[derive(Identifiable, Selectable, Queryable, Associations, Debug)]
#[diesel(belongs_to(ContentType))]
#[diesel(belongs_to(Site))]
#[diesel(table_name = sites_content_types)]
#[diesel(primary_key(content_type_id, site_id))]
pub struct SiteContentType {
	pub site_id: Uuid,
	pub content_type_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl SiteContentType {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_type_id: Uuid,
	) -> Result<Vec<Self>, AppError> {
		let site_content_type = diesel::insert_into(sites_content_types::table)
			.values(CreateSiteContentType {
				site_id,
				content_type_id,
			})
			.returning(SiteContentType::as_returning())
			.get_results(conn)?;

		Ok(site_content_type)
	}

	#[instrument(skip(conn))]
	pub fn remove(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_type_id: Uuid,
	) -> Result<(), AppError> {
		let target = sites_content_types::table.filter(
			sites_content_types::site_id
				.eq(site_id)
				.and(sites_content_types::content_type_id.eq(content_type_id)),
		);
		diesel::delete(target).execute(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = sites_content_types)]
pub struct CreateSiteContentType {
	pub site_id: Uuid,
	pub content_type_id: Uuid,
}
