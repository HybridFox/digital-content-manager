use diesel::prelude::*;
use uuid::Uuid;
use tracing::instrument;

use serde::Deserialize;

use crate::errors::AppError;
use crate::schema::{workflow_transitions, workflow_states};

use super::workflow::Workflow;
use super::workflow_state::WorkflowState;

#[derive(Identifiable, Selectable, Queryable, Debug, Clone, Associations)]
#[diesel(table_name = workflow_transitions)]
#[diesel(primary_key(id))]
#[diesel(belongs_to(Workflow))]
pub struct WorkflowTransition {
	pub id: Uuid,
	pub workflow_id: Uuid,
	pub from_workflow_state_id: Uuid,
	pub to_workflow_state_id: Uuid,
}

impl WorkflowTransition {
	#[instrument(skip(conn))]
	pub fn upsert(
		conn: &mut PgConnection,
		workflow_id: Uuid,
		values: Vec<CreateWorkflowTransition>,
	) -> Result<Vec<(Self, WorkflowState, WorkflowState)>, AppError> {
		let existing_transitions =
			workflow_transitions::table.filter(workflow_transitions::workflow_id.eq(workflow_id));
		diesel::delete(existing_transitions).execute(conn)?;

		let created_workflow_transitions = diesel::insert_into(workflow_transitions::table)
			.values(values)
			.returning(WorkflowTransition::as_returning())
			.get_results(conn)?;

		Ok(Self::populate(conn, created_workflow_transitions)?)
	}

	#[instrument(skip(conn))]
	pub fn populate_workflows(
		conn: &mut PgConnection,
		workflows: Vec<Workflow>,
	) -> Result<Vec<(Workflow, Vec<(Self, WorkflowState, WorkflowState)>)>, AppError> {
		let workflow_transitions = WorkflowTransition::belonging_to(&workflows)
			.select(WorkflowTransition::as_select())
			.load(conn)?;
		let populated_transitions = Self::populate(conn, workflow_transitions)?;

		let workflows_with_transition = workflows
			.into_iter()
			.map(|workflow| {
				let transitions = populated_transitions
					.clone()
					.into_iter()
					.filter(|transition| workflow.id == transition.0.workflow_id)
					.collect();
				(workflow, transitions)
			})
			.collect();

		Ok(workflows_with_transition)
	}

	#[instrument(skip(conn))]
	pub fn populate(
		conn: &mut PgConnection,
		transitions: Vec<Self>,
	) -> Result<Vec<(Self, WorkflowState, WorkflowState)>, AppError> {
		let id_indices: Vec<Uuid> = transitions
			.iter()
			.map(|cc| vec![cc.from_workflow_state_id, cc.to_workflow_state_id])
			.flatten()
			.collect();
		let workflow_states = workflow_states::table
			.filter(workflow_states::id.eq_any(&id_indices))
			.select(WorkflowState::as_select())
			.load::<WorkflowState>(conn)?;

		Ok(transitions
			.into_iter()
			.map(|transition| {
				let from_state = workflow_states
					.iter()
					.find(|state| transition.from_workflow_state_id == state.id)
					.unwrap()
					.clone();
				let to_state = workflow_states
					.iter()
					.find(|state| transition.to_workflow_state_id == state.id)
					.unwrap()
					.clone();

				(transition, from_state, to_state)
			})
			.collect())
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_id: Uuid) -> Result<(), AppError> {
		diesel::delete(workflow_transitions::table.filter(workflow_transitions::id.eq(content_id)))
			.get_result::<WorkflowTransition>(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = workflow_transitions)]
pub struct CreateWorkflowTransition {
	pub workflow_id: Uuid,
	pub from_workflow_state_id: Uuid,
	pub to_workflow_state_id: Uuid,
}
