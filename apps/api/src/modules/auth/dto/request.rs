use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct RegisterUserDTO {
	pub name: String,
	pub email: String,
	pub password: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct LoginUserDTO {
	pub email: String,
	pub password: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UpdateUserDTO {
	pub email: Option<String>,
	pub name: Option<String>,
	pub password: Option<String>,
	pub avatar: Option<String>,
	pub bio: Option<String>,
}
