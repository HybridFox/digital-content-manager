use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateContentRevisionDTO {
	pub name: String,
	pub workflow_state_id: Uuid,
	pub content_type_id: Uuid,
	pub language_id: Uuid,
	pub slug: String,
	pub translation_id: Option<Uuid>,
	pub fields: Value,
}
