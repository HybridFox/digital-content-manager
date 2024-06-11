use crate::modules::{
	content_components::dto::content_components::response::FieldWithContentComponentDTO,
	content_types::{
		dto::compartments::response::CompartmentDTO,
		models::{
			compartment::CompartmentModel,
			content_type::{ContentType, ContentTypeKindEnum, PopulatedContentTypeField},
		},
	},
	core::models::hal::{HALLinkList, HALPage},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use std::convert::From;
use utoipa::ToSchema;
use uuid::Uuid;

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
	pub compartments: Vec<CompartmentDTO>,
}

impl
	From<(
		ContentType,
		Vec<PopulatedContentTypeField>,
		Vec<CompartmentModel>,
	)> for ContentTypeWithFieldsDTO
{
	fn from(
		(content_type, fields, compartments): (
			ContentType,
			Vec<PopulatedContentTypeField>,
			Vec<CompartmentModel>,
		),
	) -> Self {
		Self {
			id: content_type.id,
			name: content_type.name,
			slug: content_type.slug,
			kind: content_type.kind,
			workflow_id: content_type.workflow_id,
			description: content_type.description,
			fields: fields
				.into_iter()
				.map(FieldWithContentComponentDTO::from)
				.collect(),
			compartments: compartments.into_iter().map(CompartmentDTO::from).collect(),
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
	pub updated_at: NaiveDateTime,
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
pub struct ContentTypeWithOccurrencesDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub kind: ContentTypeKindEnum,
	pub workflow_id: Uuid,
	pub description: Option<String>,
	pub content_occurrences: i64,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<(ContentType, i64)> for ContentTypeWithOccurrencesDTO {
	fn from((content_type, occurrences): (ContentType, i64)) -> Self {
		Self {
			id: content_type.id,
			name: content_type.name,
			slug: content_type.slug,
			kind: content_type.kind,
			workflow_id: content_type.workflow_id,
			content_occurrences: occurrences,
			description: content_type.description,
			created_at: content_type.created_at,
			updated_at: content_type.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentTypesEmbeddedDTO {
	pub content_types: Vec<ContentTypeWithOccurrencesDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ContentTypesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: ContentTypesEmbeddedDTO,
}

impl From<(Vec<(ContentType, i64)>, HALPage, Uuid)> for ContentTypesDTO {
	fn from((content_types, page, site_id): (Vec<(ContentType, i64)>, HALPage, Uuid)) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{}/content-types", site_id), &page)),
			_embedded: ContentTypesEmbeddedDTO {
				content_types: content_types
					.into_iter()
					.map(|content_type| ContentTypeWithOccurrencesDTO::from(content_type))
					.collect(),
			},
			_page: page,
		}
	}
}

impl From<(Vec<(ContentType, i64)>, HALPage)> for ContentTypesDTO {
	fn from((content_types, page): (Vec<(ContentType, i64)>, HALPage)) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/content-types"), &page)),
			_embedded: ContentTypesEmbeddedDTO {
				content_types: content_types
					.into_iter()
					.map(|content_type| ContentTypeWithOccurrencesDTO::from(content_type))
					.collect(),
			},
			_page: page,
		}
	}
}
