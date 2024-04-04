use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateWebhookDTO {
	pub event: String,
	pub url: String,
	pub request_configuration: Option<Value>,
	pub active: bool,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateWebhookDTO {
	pub event: Option<String>,
	pub url: Option<String>,
	pub request_configuration: Option<Value>,
	pub active: Option<bool>,
}
