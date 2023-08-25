use diesel::prelude::*;
use serde_json::Value;
use uuid::Uuid;
use tracing::instrument;

use crate::errors::AppError;
use crate::modules::content::helpers::upsert_fields::upsert_fields;
use crate::modules::content::models::content::CreateContent;
use crate::modules::content::models::content_revision::ContentRevision;
use crate::modules::content::models::content_revision::CreateContentRevision;
use crate::modules::content_types::models::content_type::ContentType;
use crate::modules::languages::models::language::Language;
use crate::modules::workflows::models::workflow_state::WorkflowState;
use crate::schema::content;

use super::super::content_field::ContentField;
use super::super::content::Content;

impl Content {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		user_id: Uuid,
		site_id: Uuid,
		content_item: CreateContent,
		values: Value,
	) -> Result<(Self, ContentRevision, Vec<ContentField>, Language, WorkflowState), AppError> {
		let created_content_item = diesel::insert_into(content::table)
			.values(&content_item)
			.returning(Content::as_returning())
			.get_result(conn)?;

		let (_content_type, fields) =
			ContentType::find_one(conn, site_id, created_content_item.content_type_id)?;

		let revision = ContentRevision::create(conn, site_id, created_content_item.id, CreateContentRevision {
			workflow_state_id: content_item.workflow_state_id,
			content_id: created_content_item.id,
			published: false,
			user_id,
			// TODO: Check this
			revision_translation_id: Uuid::new_v4(),
			site_id
		})?;

		upsert_fields(
			conn,
			revision.id,
			revision.revision_translation_id,
			fields,
			values,
			&vec![],
		)?;


		let content_item = Self::find_one(conn, site_id, created_content_item.id)?;

		Ok(content_item)
	}
}
