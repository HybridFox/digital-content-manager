use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::modules::workflows::models::workflow_state::WorkflowTechnicalStateEnum;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateWorkflowStateDTO {
	pub name: String,
	pub slug: String,
	pub description: String,
	pub technical_state: WorkflowTechnicalStateEnum,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateWorkflowStateDTO {
	pub name: String,
	pub description: String,
	pub technical_state: WorkflowTechnicalStateEnum,
}
