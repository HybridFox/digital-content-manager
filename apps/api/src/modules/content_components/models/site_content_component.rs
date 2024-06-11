use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use tracing::instrument;
use uuid::Uuid;

use crate::modules::content_components::models::content_component::ContentComponent;
use crate::modules::sites::models::site::Site;

use crate::errors::AppError;
use crate::schema::sites_content_components;

#[derive(Identifiable, Selectable, Queryable, Associations, Debug)]
#[diesel(belongs_to(ContentComponent))]
#[diesel(belongs_to(Site))]
#[diesel(table_name = sites_content_components)]
#[diesel(primary_key(content_component_id, site_id))]
pub struct SiteContentComponent {
	pub site_id: Uuid,
	pub content_component_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl SiteContentComponent {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_component_id: Uuid,
	) -> Result<Vec<Self>, AppError> {
		let permissions_iam_actions = diesel::insert_into(sites_content_components::table)
			.values(CreateSiteContentComponent {
				site_id,
				content_component_id,
			})
			.returning(SiteContentComponent::as_returning())
			.get_results(conn)?;

		Ok(permissions_iam_actions)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = sites_content_components)]
pub struct CreateSiteContentComponent {
	pub site_id: Uuid,
	pub content_component_id: Uuid,
}
