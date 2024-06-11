use crate::modules::{
	content_components::{
		dto::content_components::response::FieldDTO,
		models::content_component::PopulatedContentComponent,
	},
	content_types::models::{field::FieldModel, field_config::FieldConfigContent},
	core::models::hal::{HALLinkList, HALPage},
};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, convert::From};
use utoipa::ToSchema;
use uuid::Uuid;

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
		Vec<(
			FieldModel,
			PopulatedContentComponent,
			HashMap<String, FieldConfigContent>,
		)>,
		HALPage,
		Uuid,
		Uuid,
	)> for FieldsDTO
{
	fn from(
		(fields, page, site_id, content_type_id): (
			Vec<(
				FieldModel,
				PopulatedContentComponent,
				HashMap<String, FieldConfigContent>,
			)>,
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
