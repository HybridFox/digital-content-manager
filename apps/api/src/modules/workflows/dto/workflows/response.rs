use crate::modules::{
	workflows::{
		models::{
			workflow::Workflow, workflow_state::WorkflowState,
			workflow_transition::WorkflowTransition,
		},
		dto::workflow_states::response::WorkflowStateDTO,
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
pub struct WorkflowTransitionDTO {
	pub id: Uuid,
	pub from_state: WorkflowStateDTO,
	pub to_state: WorkflowStateDTO,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct WorkflowDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub description: Option<String>,
	pub default_workflow_state_id: Uuid,
	pub internal: bool,
	pub removable: bool,
	pub active: bool,
	pub deleted: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
	pub transitions: Vec<WorkflowTransitionDTO>,
}

impl
	From<(
		Workflow,
		Vec<(WorkflowTransition, WorkflowState, WorkflowState)>,
	)> for WorkflowDTO
{
	fn from(
		(workflow, transitions): (
			Workflow,
			Vec<(WorkflowTransition, WorkflowState, WorkflowState)>,
		),
	) -> Self {
		Self {
			id: workflow.id,
			name: workflow.name,
			slug: workflow.slug,
			description: workflow.description,
			default_workflow_state_id: workflow.default_workflow_state_id,
			internal: workflow.internal,
			removable: workflow.removable,
			active: workflow.active,
			deleted: workflow.deleted,
			created_at: workflow.created_at,
			updated_at: workflow.updated_at,
			transitions: transitions
				.into_iter()
				.map(
					|(transition, from_state, to_state)| WorkflowTransitionDTO {
						id: transition.id,
						from_state: WorkflowStateDTO::from(from_state),
						to_state: WorkflowStateDTO::from(to_state),
					},
				)
				.collect(),
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct WorkflowsEmbeddedDTO {
	pub workflows: Vec<WorkflowDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct WorkflowsDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: WorkflowsEmbeddedDTO,
}

impl
	From<(
		Vec<(
			Workflow,
			Vec<(WorkflowTransition, WorkflowState, WorkflowState)>,
		)>,
		HALPage,
		Uuid,
	)> for WorkflowsDTO
{
	fn from(
		(workflows, page, site_id): (
			Vec<(
				Workflow,
				Vec<(WorkflowTransition, WorkflowState, WorkflowState)>,
			)>,
			HALPage,
			Uuid,
		),
	) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{}/workflows", site_id), &page)),
			_embedded: WorkflowsEmbeddedDTO {
				workflows: workflows.into_iter().map(WorkflowDTO::from).collect(),
			},
			_page: page,
		}
	}
}
