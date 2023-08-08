use utoipa::ToSchema;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateDirectoryDTO {
	pub name: String,
}
