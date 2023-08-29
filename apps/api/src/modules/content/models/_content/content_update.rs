use diesel::prelude::*;
use serde_json::Value;
use uuid::Uuid;
use tracing::instrument;

use crate::errors::AppError;
use crate::modules::content::helpers::upsert_fields::upsert_fields;
use crate::modules::content::models::content_revision::{ContentRevision, CreateContentRevision};
use crate::modules::content_types::models::content_type::{ContentType, ContentTypeKindEnum};
use crate::modules::languages::models::language::Language;
use crate::modules::workflows::models::workflow_state::WorkflowState;
use crate::schema::{content, content_fields};

use super::super::content::{Content, UpdateContent};
use super::super::content_field::ContentField;

impl Content {
	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		user_id: Uuid,
		site_id: Uuid,
		content_type_id: Uuid,
		content_id: Uuid,
		changeset: UpdateContent,
		values: Value,
	) -> Result<
		(
			Self,
			ContentRevision,
			Vec<ContentField>,
			Language,
			WorkflowState,
		),
		AppError,
	> {
		let target = content::table.find(content_id);
		let _updated_content_item = diesel::update(target)
			.set(&changeset)
			.returning(Content::as_returning())
			.get_result::<Self>(conn)?;

		let (_content_type, fields) = ContentType::find_one(conn, site_id, content_type_id)?;
		// TODO: check this
		// let content_fields = content_fields::table
		// 	.filter(content_fields::source_id.eq_any(vec![content_id, updated_content_item.translation_id]))
		// 	.select(ContentField::as_select())
		// 	.load::<ContentField>(conn)?;

		let revision = ContentRevision::create(
			conn,
			site_id,
			content_id,
			CreateContentRevision {
				workflow_state_id: changeset.workflow_state_id,
				content_id,
				user_id,
				published: changeset.published.is_some(),
				// TODO: Check this
				revision_translation_id: Uuid::new_v4(),
				site_id,
			},
		)?;

		upsert_fields(
			conn,
			revision.id,
			revision.revision_translation_id,
			fields,
			values,
			&vec![],
		)?;

		let content_item = Self::find_one(conn, site_id, content_id)?;

		Ok(content_item)
	}
}
