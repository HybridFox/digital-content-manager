use crate::modules::{
	resources::models::storage_repository::StorageRepository,
	core::models::hal::{HALLinkList, HALPage},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;
use uuid::Uuid;
use std::convert::From;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct StorageRepositoryDTO {
	pub id: Uuid,
	pub name: String,
	pub kind: String,
	pub configuration: Value,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<StorageRepository> for StorageRepositoryDTO {
	fn from(storage_repository: StorageRepository) -> Self {
		Self {
			id: storage_repository.id,
			name: storage_repository.name,
			kind: storage_repository.kind,
			configuration: storage_repository.configuration,
			created_at: storage_repository.created_at,
			updated_at: storage_repository.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct StorageRepositoriesEmbeddedDTO {
	pub storage_repositories: Vec<StorageRepositoryDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct StorageRepositoriesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: StorageRepositoriesEmbeddedDTO,
}

impl From<(Vec<StorageRepository>, HALPage, Uuid)> for StorageRepositoriesDTO {
	fn from((storage_repositories, page, site_id): (Vec<StorageRepository>, HALPage, Uuid)) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{site_id}/storage-repositories"), &page)),
			_embedded: StorageRepositoriesEmbeddedDTO {
				storage_repositories: storage_repositories
					.iter()
					.map(|site| StorageRepositoryDTO::from(site.clone()))
					.collect(),
			},
			_page: page,
		}
	}
}
