use crate::modules::{
	core::models::hal::{HALLinkList, HALPage},
	resources::engines::lib::{ResourceItem, ResourceItemKind},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use std::convert::From;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ResourceDTO {
	pub name: String,
	pub kind: ResourceItemKind,
	pub created_at: Option<NaiveDateTime>,
	pub updated_at: Option<NaiveDateTime>,
}

impl From<ResourceItem> for ResourceDTO {
	fn from(entry: ResourceItem) -> Self {
		Self {
			name: entry.name,
			kind: entry.kind,
			created_at: entry.created_at,
			updated_at: entry.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ResourcesEmbeddedDTO {
	pub resources: Vec<ResourceDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ResourcesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: ResourcesEmbeddedDTO,
}

impl From<(Vec<ResourceItem>, HALPage, Uuid)> for ResourcesDTO {
	fn from((resources, page, site_id): (Vec<ResourceItem>, HALPage, Uuid)) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{}/resources", site_id), &page)),
			_embedded: ResourcesEmbeddedDTO {
				resources: resources
					.into_iter()
					.map(|entry| ResourceDTO::from(entry))
					.collect(),
			},
			_page: page,
		}
	}
}
