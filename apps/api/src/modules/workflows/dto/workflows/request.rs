use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateWorkflowDTO {
	pub name: String,
	pub slug: String,
	pub description: Option<String>,
	pub default_workflow_state_id: Uuid,
	pub transitions: Vec<UpsertWorkflowTransitionDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpsertWorkflowTransitionDTO {
	pub from_workflow_state_id: Uuid,
	pub to_workflow_state_id: Uuid,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateWorkflowDTO {
	pub name: String,
	pub description: Option<String>,
	pub default_workflow_state_id: Uuid,
	pub transitions: Vec<UpsertWorkflowTransitionDTO>,
}
