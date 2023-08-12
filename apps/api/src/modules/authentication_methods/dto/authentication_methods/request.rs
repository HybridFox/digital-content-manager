use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateAuthenticationMethodDTO {
	pub name: String,
	pub kind: String,
	pub configuration: Option<Value>,
	pub weight: i32,
	pub active: bool,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateAuthenticationMethodDTO {
	pub name: String,
	pub configuration: Option<Value>,
	pub weight: i32,
	pub active: bool,
}
