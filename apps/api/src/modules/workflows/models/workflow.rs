use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;
use tracing::instrument;

use crate::errors::AppError;
use crate::modules::workflows::dto::workflows::request::UpsertWorkflowTransitionDTO;
use crate::schema::workflows;

use super::workflow_state::WorkflowState;
use super::workflow_transition::{WorkflowTransition, CreateWorkflowTransition};

#[derive(Identifiable, Selectable, Queryable, Debug, Clone)]
#[diesel(table_name = workflows)]
#[diesel(primary_key(id))]
pub struct Workflow {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub description: String,
	pub default_workflow_state_id: Uuid,
	pub internal: bool,
	pub removable: bool,
	pub active: bool,
	pub deleted: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl Workflow {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		workflow: CreateWorkflow,
		transitions: Vec<UpsertWorkflowTransitionDTO>,
	) -> Result<
		(
			Self,
			Vec<(WorkflowTransition, WorkflowState, WorkflowState)>,
		),
		AppError,
	> {
		let workflow = diesel::insert_into(workflows::table)
			.values(workflow)
			.returning(Workflow::as_returning())
			.get_result(conn)?;

		let workflow_transitions = transitions
			.into_iter()
			.map(|transition| CreateWorkflowTransition {
				workflow_id: workflow.id,
				from_workflow_state_id: transition.from_workflow_state_id,
				to_workflow_state_id: transition.to_workflow_state_id,
			})
			.collect();
		let created_transitions =
			WorkflowTransition::upsert(conn, workflow.id, workflow_transitions)?;

		Ok((workflow, created_transitions))
	}

	#[instrument(skip(conn))]
	pub fn find_one(
		conn: &mut PgConnection,
		_site_id: Uuid,
		id: Uuid,
	) -> Result<
		(
			Self,
			Vec<(WorkflowTransition, WorkflowState, WorkflowState)>,
		),
		AppError,
	> {
		let workflow = workflows::table.find(id).first::<Self>(conn)?;
		let populated_workflow = WorkflowTransition::populate_workflows(conn, vec![workflow])?;

		Ok(populated_workflow.first().unwrap().clone())
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<
		(
			Vec<(
				Self,
				Vec<(WorkflowTransition, WorkflowState, WorkflowState)>,
			)>,
			i64,
		),
		AppError,
	> {
		let query = {
			let mut query = workflows::table
				// .filter(workflows::site_id.eq(site_id))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let workflows = query.select(Workflow::as_select()).load::<Workflow>(conn)?;
		let populated_workflows = WorkflowTransition::populate_workflows(conn, workflows)?;

		let total_elements = workflows::table
			.count()
			.get_result::<i64>(conn)?;

		Ok((populated_workflows, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		site_id: Uuid,
		id: Uuid,
		changeset: UpdateWorkflow,
		transitions: Vec<UpsertWorkflowTransitionDTO>,
	) -> Result<
		(
			Self,
			Vec<(WorkflowTransition, WorkflowState, WorkflowState)>,
		),
		AppError,
	> {
		let target = workflows::table.find(id);
		let updated_workflow = diesel::update(target)
			.set(changeset)
			.returning(Self::as_returning())
			.get_result::<Self>(conn)?;

		let workflow_transitions = transitions
			.into_iter()
			.map(|transition| CreateWorkflowTransition {
				workflow_id: updated_workflow.id,
				from_workflow_state_id: transition.from_workflow_state_id,
				to_workflow_state_id: transition.to_workflow_state_id,
			})
			.collect();
		let created_transitions =
			WorkflowTransition::upsert(conn, updated_workflow.id, workflow_transitions)?;

		Ok((updated_workflow, created_transitions))
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_id: Uuid) -> Result<(), AppError> {
		diesel::delete(workflows::table.filter(workflows::id.eq(content_id)))
			.get_result::<Workflow>(conn)?;

		Ok(())
	}

	// #[instrument(skip(conn))]
	// pub fn find_fields(
	// 	conn: &mut PgConnection,
	// 	content_types: &Vec<WorkflowType>,
	// ) -> Result<
	// 	Vec<(
	// 		FieldModel,
	// 		WorkflowComponent,
	// 		HashMap<String, FieldConfigWorkflow>,
	// 	)>,
	// 	AppError,
	// > {
	// 	let all_content_components = content_components::table
	// 		.select(WorkflowComponent::as_select())
	// 		.load::<WorkflowComponent>(conn)?;

	// 	let fields = FieldModel::belonging_to(content_types)
	// 		.select(FieldModel::as_select())
	// 		.load::<FieldModel>(conn)?;

	// 	let field_config = FieldConfig::belonging_to(&fields)
	// 		.select(FieldConfig::as_select())
	// 		.load::<FieldConfig>(conn)?;

	// 	let grouped_config: Vec<Vec<FieldConfig>> = field_config.grouped_by(&fields);
	// 	let fields_with_config = fields
	// 		.into_iter()
	// 		.zip(grouped_config)
	// 		.map(|(field, field_configs)| {
	// 			let populated_field_configs =
	// 				WorkflowComponent::populate_config(conn, field_configs)?;
	// 			let content_component = all_content_components
	// 				.iter()
	// 				.find(|cp| cp.id == field.content_component_id)
	// 				.map(|cp| cp.to_owned());

	// 			Ok((field, content_component.unwrap(), populated_field_configs))
	// 		})
	// 		.collect::<Result<
	// 			Vec<(
	// 				FieldModel,
	// 				WorkflowComponent,
	// 				HashMap<String, FieldConfigWorkflow>,
	// 			)>,
	// 			AppError,
	// 		>>()?;

	// 	Ok(fields_with_config)
	// }
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = workflows)]
pub struct CreateWorkflow {
	pub name: String,
	pub slug: String,
	pub description: String,
	pub default_workflow_state_id: Uuid,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = workflows)]
pub struct UpdateWorkflow {
	pub name: String,
	pub description: String,
	pub default_workflow_state_id: Uuid,
}
