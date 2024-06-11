use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use tracing::instrument;
use uuid::Uuid;

use crate::errors::AppError;
use crate::modules::users::models::user::User;
use crate::modules::workflows::models::workflow_state::WorkflowState;
use crate::schema::users;
use crate::schema::{content_fields, content_revisions, workflow_states};

use super::content::Content;
use super::content_field::ContentField;

#[derive(Identifiable, Selectable, Queryable, Debug, Associations, Clone)]
#[diesel(table_name = content_revisions)]
#[diesel(belongs_to(Content))]
#[diesel(primary_key(id))]
pub struct ContentRevision {
	pub id: Uuid,
	pub workflow_state_id: Uuid,
	pub revision_translation_id: Uuid,
	pub content_id: Uuid,
	pub site_id: Uuid,
	pub user_id: Uuid,
	pub published: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl ContentRevision {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_id: Uuid,
		revision: CreateContentRevision,
	) -> Result<Self, AppError> {
		let created_revision = diesel::insert_into(content_revisions::table)
			.values(&revision)
			.returning(Self::as_returning())
			.get_result(conn)?;

		Ok(created_revision)
	}

	#[instrument(skip(conn))]
	pub fn find_one(
		conn: &mut PgConnection,
		site_id: Uuid,
		id: Uuid,
	) -> Result<(Self, Vec<ContentField>, WorkflowState, User), AppError> {
		let revision = content_revisions::table
			.filter(content_revisions::site_id.eq(site_id))
			.find(id)
			.first::<Self>(conn)?;

		let fields = content_fields::table
			.filter(
				content_fields::source_id
					.eq_any(vec![revision.id, revision.revision_translation_id]),
			)
			.select(ContentField::as_select())
			.load::<ContentField>(conn)?;

		let workflow_state = workflow_states::table
			.find(revision.workflow_state_id)
			.first(conn)?;

		let user = users::table.find(revision.user_id).first(conn)?;

		Ok((revision, fields, workflow_state, user))
	}

	#[instrument(skip(conn))]
	pub fn default_values(
		conn: &mut PgConnection,
		_site_id: Uuid,
		translation_id: Uuid,
	) -> Result<Vec<ContentField>, AppError> {
		let fields = content_fields::table
			.filter(content_fields::source_id.eq_any(vec![translation_id]))
			.select(ContentField::as_select())
			.load::<ContentField>(conn)?;

		Ok(fields)
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_id: Uuid,
		page: i64,
		pagesize: i64,
		revision_translation_id: Option<Uuid>,
	) -> Result<(Vec<(Self, WorkflowState, User)>, i64), AppError> {
		let query = {
			let mut query = content_revisions::table
				.filter(content_revisions::site_id.eq(site_id))
				.filter(content_revisions::content_id.eq(content_id))
				.order(content_revisions::created_at.desc())
				.inner_join(
					workflow_states::table
						.on(workflow_states::id.eq(content_revisions::workflow_state_id)),
				)
				.inner_join(users::table.on(users::id.eq(content_revisions::user_id)))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			if let Some(revision_translation_id) = revision_translation_id {
				query = query
					.filter(content_revisions::revision_translation_id.eq(revision_translation_id));
			}

			query
		};

		let total_query = {
			let mut query = content_revisions::table
				.filter(content_revisions::site_id.eq(site_id))
				.into_boxed();

			if let Some(revision_translation_id) = revision_translation_id {
				query = query
					.filter(content_revisions::revision_translation_id.eq(revision_translation_id));
			}

			query
		};

		let revisions = query
			.select((
				ContentRevision::as_select(),
				WorkflowState::as_select(),
				User::as_select(),
			))
			.load::<(ContentRevision, WorkflowState, User)>(conn)?;

		let total_elements = total_query.count().get_result::<i64>(conn)?;

		Ok((revisions, total_elements))
	}

	// #[instrument(skip(conn))]
	// pub fn update(
	// 	conn: &mut PgConnection,
	// 	site_id: Uuid,
	// 	content_type_id: Uuid,
	// 	id: Uuid,
	// 	changeset: UpdateContent,
	// 	values: Value,
	// ) -> Result<(Self, Vec<ContentField>, Language, WorkflowState), AppError> {
	// 	let target = content_revisions::table.find(id);
	// 	let updated_content_item = diesel::update(target)
	// 		.set(changeset)
	// 		.returning(Content::as_returning())
	// 		.get_result::<Self>(conn)?;

	// 	let (_content_type, fields) = ContentType::find_one(conn, site_id, content_type_id)?;
	// 	let content_fields = content_fields::table
	// 		.filter(content_fields::source_id.eq_any(vec![id, updated_content_item.translation_id]))
	// 		.select(ContentField::as_select())
	// 		.load::<ContentField>(conn)?;
	// 	upsert_fields(
	// 		conn,
	// 		id,
	// 		updated_content_item.translation_id,
	// 		fields,
	// 		values,
	// 		&content_fields,
	// 	)?;

	// 	let content_item = Self::find_one(conn, site_id, id)?;

	// 	Ok(content_item)
	// }

	// #[instrument(skip(conn))]
	// pub fn remove(conn: &mut PgConnection, content_id: Uuid) -> Result<(), AppError> {
	// 	diesel::delete(content_revisions::table.filter(content_revisions::id.eq(content_id)))
	// 		.get_result::<Content>(conn)?;

	// 	Ok(())
	// }
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = content_revisions)]
pub struct CreateContentRevision {
	pub workflow_state_id: Uuid,
	pub content_id: Uuid,
	pub user_id: Uuid,
	pub published: bool,
	pub revision_translation_id: Uuid,
	pub site_id: Uuid,
}

// #[derive(AsChangeset, Debug, Deserialize, Clone)]
// #[diesel(table_name = content_revisions)]
// pub struct UpdateContentRevision {
// 	pub name: Option<String>,
// 	pub slug: Option<String>,
// 	pub published: bool,
// 	pub workflow_state_id: Uuid,
// 	pub updated_at: NaiveDateTime,
// }
