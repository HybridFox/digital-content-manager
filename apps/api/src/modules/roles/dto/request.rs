use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateRoleDTO {
	pub name: String,
	pub roles: Vec<Uuid>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UpdateRoleDTO {
	pub name: Option<String>,
	pub roles: Vec<Uuid>,
}
