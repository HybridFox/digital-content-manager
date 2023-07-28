use crate::modules::{
	content::models::content::Content,
	core::models::hal::{HALLinkList, HALPage}
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use std::convert::From;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub workflow_state_id: Uuid,
	pub published: bool,
	pub deleted: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
	// pub fields: Vec<FieldDTO>,
}

impl
	From<Content> for ContentDTO
{
	fn from(
		content: Content,
	) -> Self {
		Self {
			id: content.id,
			name: content.name,
			slug: content.slug,
			workflow_state_id: content.workflow_state_id,
			published: content.published,
			deleted: content.deleted,
			created_at: content.created_at,
			updated_at: content.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentListEmbeddedDTO {
	pub content: Vec<ContentDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ContentListDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: ContentListEmbeddedDTO,
}

impl
	From<(
		Vec<Content>,
		HALPage,
		Uuid,
	)> for ContentListDTO
{
	fn from(
		(content, page, site_id): (
			Vec<Content>,
			HALPage,
			Uuid,
		),
	) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{}/content", site_id), &page)),
			_embedded: ContentListEmbeddedDTO {
				content: content
					.into_iter()
					.map(ContentDTO::from)
					.collect(),
			},
			_page: page,
		}
	}
}
