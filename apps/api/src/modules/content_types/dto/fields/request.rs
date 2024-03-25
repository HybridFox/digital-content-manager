use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateFieldDTO {
	pub name: String,
	pub content_component_id: Uuid,
	pub compartment_id: Option<Uuid>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateFieldDTO {
	pub name: Option<String>,
	pub description: Option<String>,
	pub min: Option<i32>,
	pub max: Option<i32>,
	pub hidden: Option<bool>,
	pub multi_language: Option<bool>,
	pub compartment_id: Option<Uuid>,
	pub validation: Option<Value>,
	pub sequence_number: Option<i32>,
	pub config: HashMap<String, Value>,
}
