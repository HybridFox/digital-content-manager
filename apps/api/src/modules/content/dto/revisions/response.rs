use crate::modules::{
	content::{
		models::{content_revision::ContentRevision, content_field::ContentField},
		dto::content::response::parse_object_fields,
	},
	core::models::hal::{HALLinkList, HALPage},
	workflows::{
		dto::workflow_states::response::WorkflowStateDTO, models::workflow_state::WorkflowState,
	},
	users::models::user::User,
	auth::dto::response::UserDTO,
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;
use uuid::Uuid;
use std::{convert::From, collections::HashMap};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentRevisionWithFieldsDTO {
	pub id: Uuid,
	pub workflow_state_id: Uuid,
	pub revision_translation_id: Uuid,
	pub published: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
	pub workflow_state: WorkflowStateDTO,
	pub user: UserDTO,
	pub fields: HashMap<String, Option<Value>>,
}

impl From<(ContentRevision, Vec<ContentField>, WorkflowState, User)> for ContentRevisionWithFieldsDTO {
	fn from(
		(content_revision, fields, workflow_state, user): (
			ContentRevision,
			Vec<ContentField>,
			WorkflowState,
			User,
		),
	) -> Self {
		Self {
			id: content_revision.id,
			workflow_state_id: content_revision.workflow_state_id,
			revision_translation_id: content_revision.revision_translation_id,
			published: content_revision.published,
			created_at: content_revision.created_at,
			updated_at: content_revision.updated_at,
			workflow_state: WorkflowStateDTO::from(workflow_state),
			user: UserDTO::from(user),
			fields: parse_object_fields(
				Some(content_revision.id),
				content_revision.revision_translation_id,
				None,
				fields,
				false,
			),
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentRevisionDTO {
	pub id: Uuid,
	pub workflow_state_id: Uuid,
	pub revision_translation_id: Uuid,
	pub published: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
	pub workflow_state: WorkflowStateDTO,
	pub user: UserDTO,
}

impl From<(ContentRevision, WorkflowState, User)> for ContentRevisionDTO {
	fn from(
		(content_revision, workflow_state, user): (ContentRevision, WorkflowState, User),
	) -> Self {
		Self {
			id: content_revision.id,
			workflow_state_id: content_revision.workflow_state_id,
			revision_translation_id: content_revision.revision_translation_id,
			published: content_revision.published,
			created_at: content_revision.created_at,
			updated_at: content_revision.updated_at,
			workflow_state: WorkflowStateDTO::from(workflow_state),
			user: UserDTO::from(user),
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ContentRevisionsEmbeddedDTO {
	pub content_revisions: Vec<ContentRevisionDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ContentRevisionsDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: ContentRevisionsEmbeddedDTO,
}

impl From<(Vec<(ContentRevision, WorkflowState, User)>, HALPage, Uuid)> for ContentRevisionsDTO {
	fn from(
		(revisions, page, site_id): (Vec<(ContentRevision, WorkflowState, User)>, HALPage, Uuid),
	) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{}/content", site_id), &page)),
			_embedded: ContentRevisionsEmbeddedDTO {
				content_revisions: revisions
					.into_iter()
					.map(ContentRevisionDTO::from)
					.collect(),
			},
			_page: page,
		}
	}
}
