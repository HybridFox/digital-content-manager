use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::modules::content_types::models::content_type::ContentTypeKindEnum;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateContentTypeDTO {
	pub name: String,
	pub description: String,
	// pub slug: Option<String>,
	pub kind: ContentTypeKindEnum,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UpdateContentTypeDTO {
	pub name: Option<String>,
	pub description: Option<String>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateFieldDTO {
	pub name: String,
	pub content_component_id: Uuid,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UpdateFieldDTO {
	pub name: Option<String>,
	pub description: Option<String>,
	pub min: Option<i32>,
	pub max: Option<i32>,
	pub hidden: Option<bool>,
	pub multi_language: Option<bool>,
	pub config: HashMap<String, Value>
}
