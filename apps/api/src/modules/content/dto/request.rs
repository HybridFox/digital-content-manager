use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateContentDTO {
	pub name: String,
	pub workflow_state_id: Uuid,
	pub translation_id: Option<Uuid>,
	pub fields: Value
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateContentDTO {
	pub name: Option<String>,
	pub workflow_state_id: Uuid,
	pub fields: Value
}
