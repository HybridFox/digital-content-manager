use crate::modules::{
	content_types::models::{
		content_type::ContentType, field::FieldModel, field_config::FieldConfigContent,
	},
	core::models::hal::{HALLinkList, HALPage},
	content_components::{models::content_component::ContentComponent, dto::response::FieldDTO},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use std::{convert::From, collections::HashMap};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentTypeDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub description: Option<String>,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
	pub fields: Vec<FieldDTO>,
}

impl
	From<(
		ContentType,
		Vec<(FieldModel, ContentComponent, HashMap<String, FieldConfigContent>)>,
	)> for ContentTypeDTO
{
	fn from(
		(content_type, fields): (
			ContentType,
			Vec<(FieldModel, ContentComponent, HashMap<String, FieldConfigContent>)>,
		),
	) -> Self {
		Self {
			id: content_type.id,
			name: content_type.name,
			slug: content_type.slug,
			description: content_type.description,
			fields: fields.into_iter().map(FieldDTO::from).collect(),
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
		Vec<(
			ContentType,
			Vec<(FieldModel, ContentComponent, HashMap<String, FieldConfigContent>)>,
		)>,
		HALPage,
		Uuid,
	)> for ContentTypesDTO
{
	fn from(
		(content_types, page, site_id): (
			Vec<(
				ContentType,
				Vec<(FieldModel, ContentComponent, HashMap<String, FieldConfigContent>)>,
			)>,
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

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct FieldsEmbeddedDTO {
	pub fields: Vec<FieldDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct FieldsDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: FieldsEmbeddedDTO,
}

impl
	From<(
		Vec<(FieldModel, ContentComponent, HashMap<String, FieldConfigContent>)>,
		HALPage,
		Uuid,
		Uuid,
	)> for FieldsDTO
{
	fn from(
		(fields, page, site_id, content_type_id): (
			Vec<(FieldModel, ContentComponent, HashMap<String, FieldConfigContent>)>,
			HALPage,
			Uuid,
			Uuid,
		),
	) -> Self {
		Self {
			_links: HALLinkList::from((
				format!(
					"/api/v1/sites/{}/content-types/{}/fields",
					site_id, content_type_id
				),
				&page,
			)),
			_embedded: FieldsEmbeddedDTO {
				fields: fields.into_iter().map(FieldDTO::from).collect(),
			},
			_page: page,
		}
	}
}
