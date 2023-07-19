use crate::modules::{
	assets::models::asset::Asset,
	core::models::hal::{HALLinkList, HALPage},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use std::convert::From;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct AssetDTO {
	pub id: Uuid,
	pub name: String,
	pub description: Option<String>,
	pub file_extension: String,
	pub file_reference: String,
	pub file_size: i64,
	pub file_mime: String,
	pub site_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<Asset> for AssetDTO {
	fn from(site: Asset) -> Self {
		Self {
			id: site.id,
			name: site.name,
			description: site.description,
			file_extension: site.file_extension,
			file_reference: site.file_reference,
			file_size: site.file_size,
			file_mime: site.file_mime,
			site_id: site.site_id,
			created_at: site.created_at,
			updated_at: site.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct AssetsEmbeddedDTO {
	pub assets: Vec<AssetDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct AssetsDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: AssetsEmbeddedDTO,
}

impl From<(Vec<Asset>, HALPage, Uuid)> for AssetsDTO {
	fn from((assets, page, site_id): (Vec<Asset>, HALPage, Uuid)) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{site_id}/assets"), &page)),
			_embedded: AssetsEmbeddedDTO {
				assets: assets
					.iter()
					.map(|site| AssetDTO::from(site.clone()))
					.collect(),
			},
			_page: page,
		}
	}
}
