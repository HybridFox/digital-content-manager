use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateContentTypeDTO {
	pub name: String,
	pub fields: Vec<CreateFieldDTO>
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateFieldDTO {
	pub name: String,
}
