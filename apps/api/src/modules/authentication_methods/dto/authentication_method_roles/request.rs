use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateAuthenticationMethodRoleDTO {
	pub role_id: Uuid,
	pub site_id: Option<Uuid>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateAuthenticationMethodRoleDTO {
	pub role_id: Uuid,
}
