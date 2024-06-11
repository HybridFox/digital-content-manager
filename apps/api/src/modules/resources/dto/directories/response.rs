use crate::modules::{
	core::models::hal::{HALLinkList, HALPage},
	resources::engines::lib::{ResourceItem, ResourceItemKind},
};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::convert::From;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ResourceDTO {
	pub name: String,
	pub kind: ResourceItemKind,
	pub mime_type: Option<String>,
	pub storage_repository_id: Uuid,
	pub created_at: Option<DateTime<Utc>>,
	pub updated_at: Option<DateTime<Utc>>,
}

impl From<(ResourceItem, Uuid)> for ResourceDTO {
	fn from((entry, storage_repository_id): (ResourceItem, Uuid)) -> Self {
		Self {
			name: entry.name,
			kind: entry.kind,
			mime_type: entry.mime_type,
			created_at: entry.created_at,
			updated_at: entry.updated_at,
			storage_repository_id,
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

impl From<(Vec<ResourceItem>, HALPage, Uuid, Uuid)> for ResourcesDTO {
	fn from(
		(resources, page, site_id, storage_repository_id): (Vec<ResourceItem>, HALPage, Uuid, Uuid),
	) -> Self {
		Self {
			_links: HALLinkList::from((
				format!(
					"/api/v1/sites/{}/storage-repositories/{}/directories",
					site_id, storage_repository_id
				),
				&page,
			)),
			_embedded: ResourcesEmbeddedDTO {
				resources: resources
					.into_iter()
					.map(|entry| ResourceDTO::from((entry, storage_repository_id)))
					.collect(),
			},
			_page: page,
		}
	}
}
