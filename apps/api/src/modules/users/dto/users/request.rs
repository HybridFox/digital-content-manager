use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UpdateUserDTO {
	pub roles: Vec<Uuid>
}
