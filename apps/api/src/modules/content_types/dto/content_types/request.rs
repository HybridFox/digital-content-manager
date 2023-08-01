use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::modules::content_types::models::content_type::ContentTypeKindEnum;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateContentTypeDTO {
	pub name: String,
	pub description: String,
	pub workflow_id: Uuid,
	pub kind: ContentTypeKindEnum,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateContentTypeDTO {
	pub name: Option<String>,
	pub description: Option<String>,
}
