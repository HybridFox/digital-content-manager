use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateContentComponentDTO {
	pub name: String,
	// pub fields: Vec<CreateFieldDTO>
}
