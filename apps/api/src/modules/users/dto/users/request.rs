use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UpdateSiteUserDTO {
	pub roles: Vec<Uuid>
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UpdateUserDTO {
	pub roles: Vec<Uuid>,
	pub name: String,
	pub email: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateUserDTO {
	pub name: String,
	pub email: String,
	pub password: String,
	pub roles: Vec<Uuid>
}
