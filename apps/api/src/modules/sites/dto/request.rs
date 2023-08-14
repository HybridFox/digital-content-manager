use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateSiteDTO {
	pub name: String,
	pub languages: Vec<Uuid>
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UpdateSiteDTO {
	pub name: Option<String>,
	pub languages: Vec<Uuid>
}
