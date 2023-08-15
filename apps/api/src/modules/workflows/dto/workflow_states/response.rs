use crate::modules::{
	workflows::models::{
		workflow_state::WorkflowState, workflow_state::WorkflowTechnicalStateEnum,
	},
	core::models::hal::{HALLinkList, HALPage},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use std::convert::From;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct WorkflowStateDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub description: Option<String>,
	pub technical_state: WorkflowTechnicalStateEnum,
	pub internal: bool,
	pub removable: bool,
	pub deleted: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<WorkflowState> for WorkflowStateDTO {
	fn from(workflow_state: WorkflowState) -> Self {
		Self {
			id: workflow_state.id,
			name: workflow_state.name,
			slug: workflow_state.slug,
			description: workflow_state.description,
			technical_state: workflow_state.technical_state,
			internal: workflow_state.internal,
			removable: workflow_state.removable,
			deleted: workflow_state.deleted,
			created_at: workflow_state.created_at,
			updated_at: workflow_state.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct WorkflowStatesEmbeddedDTO {
	pub workflow_states: Vec<WorkflowStateDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct WorkflowStatesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: WorkflowStatesEmbeddedDTO,
}

impl From<(Vec<WorkflowState>, HALPage, Uuid)> for WorkflowStatesDTO {
	fn from((workflow_states, page, site_id): (Vec<WorkflowState>, HALPage, Uuid)) -> Self {
		Self {
			_links: HALLinkList::from((
				format!("/api/v1/sites/{}/workflow-states", site_id),
				&page,
			)),
			_embedded: WorkflowStatesEmbeddedDTO {
				workflow_states: workflow_states
					.into_iter()
					.map(WorkflowStateDTO::from)
					.collect(),
			},
			_page: page,
		}
	}
}
