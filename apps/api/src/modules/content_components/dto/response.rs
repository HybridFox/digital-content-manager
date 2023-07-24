use crate::modules::{
	content_components::models::content_component::ContentComponent, core::models::hal::{HALLinkList, HALPage}, content_types::models::{field::FieldModel, field_config::FieldConfig}
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use std::{convert::From, collections::HashMap};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentComponentDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub component_name: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<ContentComponent> for ContentComponentDTO {
	fn from(content_component: ContentComponent) -> Self {
		Self {
			id: content_component.id,
			name: content_component.name,
			slug: content_component.slug,
			component_name: content_component.component_name,
			created_at: content_component.created_at,
			updated_at: content_component.updated_at
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct FieldDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub content_component: ContentComponentDTO,
	pub config: HashMap<String, String>
}

impl From<(FieldModel, ContentComponent, Vec<FieldConfig>)> for FieldDTO {
	fn from((field, content_component, config): (FieldModel, ContentComponent, Vec<FieldConfig>)) -> Self {
		println!("{:#?}", &config);
		let config_map = config
			.into_iter()
			.map(|config_item| (config_item.config_key, config_item.content))
			.collect::<HashMap<_, _>>();

			println!("{:#?}", config_map);

		Self {
			id: field.id,
			name: field.name,
			slug: field.slug,
			content_component: ContentComponentDTO::from(content_component),
			config: config_map
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct FieldWithContentComponentDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub content_component: ContentComponentWithFieldsDTO,
	pub config: HashMap<String, String>
}

impl From<(FieldModel, (ContentComponent, Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>), Vec<FieldConfig>)> for FieldWithContentComponentDTO {
	fn from((field, content_component, config): (FieldModel, (ContentComponent, Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>), Vec<FieldConfig>)) -> Self {
		println!("{:#?}", &config);
		let config_map = config
			.into_iter()
			.map(|config_item| (config_item.config_key, config_item.content))
			.collect::<HashMap<_, _>>();

			println!("{:#?}", config_map);

		Self {
			id: field.id,
			name: field.name,
			slug: field.slug,
			content_component: ContentComponentWithFieldsDTO::from(content_component),
			config: config_map
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentComponentWithFieldsDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub component_name: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
	pub config_fields: Vec<FieldDTO>,
}

impl From<(ContentComponent, Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>)> for ContentComponentWithFieldsDTO {
	fn from((content_component, fields): (ContentComponent, Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>)) -> Self {
		Self {
			id: content_component.id,
			name: content_component.name,
			slug: content_component.slug,
			component_name: content_component.component_name,
			created_at: content_component.created_at,
			updated_at: content_component.updated_at,
			config_fields: fields.into_iter().map(FieldDTO::from).collect()
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentComponentsEmbeddedDTO {
	pub content_components: Vec<ContentComponentWithFieldsDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ContentComponentsDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: ContentComponentsEmbeddedDTO,
}

impl From<(Vec<(ContentComponent, Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>)>, HALPage, Uuid)> for ContentComponentsDTO {
	fn from((content_components, page, site_id): (Vec<(ContentComponent, Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>)>, HALPage, Uuid)) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{}/content-components", site_id), &page)),
			_embedded: ContentComponentsEmbeddedDTO {
				content_components: content_components
					.into_iter()
					.map(|content_component| ContentComponentWithFieldsDTO::from(content_component))
					.collect(),
			},
			_page: page,
		}
	}
}
