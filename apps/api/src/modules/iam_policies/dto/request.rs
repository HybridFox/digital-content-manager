use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateIAMPolicyDTO {
	pub name: String,
	pub permissions: Vec<CreateIAMPolicyPermissionDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateIAMPolicyPermissionDTO {
	#[schema(example = "grant", default = "grant")]
	pub effect: String,
	pub resources: Vec<String>,
	pub conditions: Option<Vec<CreateIAMPolicyPermissionConditionDTO>>,
	pub actions: Vec<String>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateIAMPolicyPermissionConditionDTO {
	pub id: Uuid,
	pub value: String,
	pub active: bool,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CreateIAMPolicyPermissionActionDTO {
	pub id: Uuid,
	pub active: bool,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UpdateIAMPolicyDTO {
	pub name: Option<String>,
	pub permissions: Vec<CreateIAMPolicyPermissionDTO>,
}
