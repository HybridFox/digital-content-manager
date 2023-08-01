use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateContentComponentDTO {
	pub name: String,
	pub description: Option<String>,
	pub component_name: String,
	pub workflow_id: Uuid
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateContentComponentDTO {
	pub name: Option<String>,
	pub description: Option<String>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateCCFieldDTO {
	pub name: String,
	pub content_component_id: Uuid,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCCFieldDTO {
	pub name: Option<String>,
	pub description: Option<String>,
	pub min: Option<i32>,
	pub max: Option<i32>,
	pub hidden: Option<bool>,
	pub multi_language: Option<bool>,
	pub config: HashMap<String, Value>
}
