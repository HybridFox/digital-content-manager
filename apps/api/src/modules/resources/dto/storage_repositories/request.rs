use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateStorageRepositoryDTO {
	pub name: String,
	pub kind: String,
	pub configuration: Value
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateStorageRepositoryDTO {
	pub name: Option<String>,
	pub configuration: Option<Value>
}
