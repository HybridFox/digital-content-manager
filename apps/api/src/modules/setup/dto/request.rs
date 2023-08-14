use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SetupInstanceDTO {
	pub email: String,
	pub name: String,
	pub password: String,
}
