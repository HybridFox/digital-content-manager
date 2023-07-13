use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateSiteDTO {
	pub name: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UpdateSiteDTO {
	pub name: Option<String>,
}
