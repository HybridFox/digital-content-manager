use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateContentTypeDTO {
	pub name: String,
	pub description: String
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UpdateContentTypeDTO {
	pub name: Option<String>,
	pub description: Option<String>
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
	pub description: Option<String>
}
