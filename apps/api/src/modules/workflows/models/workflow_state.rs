use std::io::Write;

use chrono::NaiveDateTime;
use diesel::prelude::*;
use utoipa::ToSchema;
use uuid::Uuid;
use tracing::instrument;

use diesel::{FromSqlRow, AsExpression};
use diesel::deserialize::{self, FromSql};
use diesel::pg::{Pg, PgValue};
use serde::{Deserialize, Serialize};
use diesel::serialize::{self, IsNull, Output, ToSql};

use crate::errors::AppError;
use crate::schema::{workflow_states, sql_types::WorkflowStateTechnicalStates};

#[derive(
	Debug, PartialEq, FromSqlRow, AsExpression, Eq, Clone, Deserialize, Serialize, ToSchema,
)]
#[diesel(sql_type = WorkflowStateTechnicalStates)]
pub enum WorkflowTechnicalStateEnum {
	DRAFT,
	UNPUBLISHED,
	PUBLISHED,
}

impl ToSql<WorkflowStateTechnicalStates, Pg> for WorkflowTechnicalStateEnum {
	fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
		match *self {
			WorkflowTechnicalStateEnum::DRAFT => out.write_all(b"DRAFT")?,
			WorkflowTechnicalStateEnum::PUBLISHED => out.write_all(b"PUBLISHED")?,
			WorkflowTechnicalStateEnum::UNPUBLISHED => out.write_all(b"UNPUBLISHED")?,
		}
		Ok(IsNull::No)
	}
}

impl FromSql<WorkflowStateTechnicalStates, Pg> for WorkflowTechnicalStateEnum {
	fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
		match bytes.as_bytes() {
			b"DRAFT" => Ok(WorkflowTechnicalStateEnum::DRAFT),
			b"PUBLISHED" => Ok(WorkflowTechnicalStateEnum::PUBLISHED),
			b"UNPUBLISHED" => Ok(WorkflowTechnicalStateEnum::UNPUBLISHED),
			_ => Err("Unrecognized enum variant".into()),
		}
	}
}

#[derive(Identifiable, Selectable, Queryable, Debug, Clone)]
#[diesel(table_name = workflow_states)]
#[diesel(primary_key(id))]
pub struct WorkflowState {
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

impl WorkflowState {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		values: CreateWorkflowState,
	) -> Result<Self, AppError> {
		let workflow = diesel::insert_into(workflow_states::table)
			.values(values)
			.returning(WorkflowState::as_returning())
			.get_result(conn)?;

		// SiteWorkflowStateType::create(conn, site_id, workflow.id)?;

		Ok(workflow)
	}

	#[instrument(skip(conn))]
	pub fn find_one(conn: &mut PgConnection, _site_id: Uuid, id: Uuid) -> Result<Self, AppError> {
		let content = workflow_states::table.find(id).first::<Self>(conn)?;
		// let fields_with_config = Self::find_fields(conn, &vec![content.clone()])?;

		Ok(content)
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let query = {
			let mut query = workflow_states::table
				// .filter(workflow_states::site_id.eq(site_id))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let workflow_states = query
			.select(WorkflowState::as_select())
			.load::<WorkflowState>(conn)?;

		let total_elements = workflow_states::table
			// .filter(content::site_id.eq(site_id))
			.count()
			.get_result::<i64>(conn)?;

		Ok((workflow_states, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		site_id: Uuid,
		id: Uuid,
		changeset: UpdateWorkflowState,
	) -> Result<Self, AppError> {
		let target = workflow_states::table.find(id);
		diesel::update(target)
			.set(changeset)
			.get_result::<Self>(conn)?;

		let workflow = Self::find_one(conn, site_id, id)?;

		Ok(workflow)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_id: Uuid) -> Result<(), AppError> {
		diesel::delete(workflow_states::table.filter(workflow_states::id.eq(content_id)))
			.get_result::<WorkflowState>(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = workflow_states)]
pub struct CreateWorkflowState {
	pub name: String,
	pub slug: String,
	pub description: Option<String>,
	pub technical_state: WorkflowTechnicalStateEnum,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = workflow_states)]
pub struct UpdateWorkflowState {
	pub name: String,
	pub description: Option<String>,
	pub technical_state: WorkflowTechnicalStateEnum,
}
