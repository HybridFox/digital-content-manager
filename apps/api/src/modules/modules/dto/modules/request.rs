use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateModuleDTO {
	pub name: String,
	pub entry_url: String,
	pub active: bool,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateModuleDTO {
	pub name: Option<String>,
	pub entry_url: Option<String>,
	pub active: Option<bool>,
}
