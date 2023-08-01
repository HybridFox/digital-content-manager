use crate::modules::{
	content_types::models::content_type::{ContentType, ContentTypeKindEnum, PopulatedContentTypeField},
	core::models::hal::{HALLinkList, HALPage},
	content_components::dto::content_components::response::FieldWithContentComponentDTO
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use std::convert::From;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentTypeWithFieldsDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub kind: ContentTypeKindEnum,
	pub workflow_id: Uuid,
	pub description: Option<String>,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
	pub fields: Vec<FieldWithContentComponentDTO>,
}

impl From<(ContentType, Vec<PopulatedContentTypeField>)> for ContentTypeWithFieldsDTO {
	fn from((content_type, fields): (ContentType, Vec<PopulatedContentTypeField>)) -> Self {
		Self {
			id: content_type.id,
			name: content_type.name,
			slug: content_type.slug,
			kind: content_type.kind,
			workflow_id: content_type.workflow_id,
			description: content_type.description,
			fields: fields.into_iter().map(FieldWithContentComponentDTO::from).collect(),
			created_at: content_type.created_at,
			updated_at: content_type.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentTypeDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub kind: ContentTypeKindEnum,
	pub workflow_id: Uuid,
	pub description: Option<String>,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime
}

impl From<ContentType> for ContentTypeDTO {
	fn from(content_type: ContentType) -> Self {
		Self {
			id: content_type.id,
			name: content_type.name,
			slug: content_type.slug,
			kind: content_type.kind,
			workflow_id: content_type.workflow_id,
			description: content_type.description,
			created_at: content_type.created_at,
			updated_at: content_type.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentTypesEmbeddedDTO {
	pub content_types: Vec<ContentTypeDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ContentTypesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: ContentTypesEmbeddedDTO,
}

impl
	From<(
		Vec<ContentType>,
		HALPage,
		Uuid,
	)> for ContentTypesDTO
{
	fn from(
		(content_types, page, site_id): (
			Vec<ContentType>,
			HALPage,
			Uuid,
		),
	) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{}/content-types", site_id), &page)),
			_embedded: ContentTypesEmbeddedDTO {
				content_types: content_types
					.into_iter()
					.map(|content_type| ContentTypeDTO::from(content_type))
					.collect(),
			},
			_page: page,
		}
	}
}
