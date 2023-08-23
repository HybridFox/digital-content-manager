use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;
use tracing::instrument;

use crate::modules::content_components::models::content_component::ContentType;
use crate::modules::sites::models::site::Site;

use crate::errors::AppError;
use crate::schema::sites_content_components;

#[derive(Identifiable, Selectable, Queryable, Associations, Debug)]
#[diesel(belongs_to(ContentType))]
#[diesel(belongs_to(Site))]
#[diesel(table_name = sites_content_components)]
#[diesel(primary_key(content_component_id, site_id))]
pub struct SiteContentType {
	pub site_id: Uuid,
	pub content_component_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl SiteContentType {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_component_id: Uuid,
	) -> Result<Vec<Self>, AppError> {
		let permissions_iam_actions = diesel::insert_into(sites_content_components::table)
			.values(CreateSiteContentType {
				site_id,
				content_component_id,
			})
			.returning(SiteContentType::as_returning())
			.get_results(conn)?;

		Ok(permissions_iam_actions)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = sites_content_components)]
pub struct CreateSiteContentType {
	pub site_id: Uuid,
	pub content_component_id: Uuid,
}
