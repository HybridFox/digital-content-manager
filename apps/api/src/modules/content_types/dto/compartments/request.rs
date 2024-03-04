use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateCompartmentDTO {
	pub name: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCompartmentDTO {
	pub name: Option<String>,
	pub description: Option<String>,
}
