use crate::modules::{
	iam_actions::models::iam_action::IAMAction,
	core::models::hal::{HALLinkList, HALPage},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::{ToSchema};
use std::{convert::From};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct IAMActionDTO {
	pub key: String,
	pub description: Option<String>,
	pub active: bool,
	pub deprecated: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<IAMAction> for IAMActionDTO {
	fn from(action: IAMAction) -> Self {
		Self {
			key: action.key,
			description: action.description,
			active: action.active,
			deprecated: action.deprecated,
			created_at: action.created_at,
			updated_at: action.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct IAMActionsEmbeddedDTO {
	pub iam_actions: Vec<IAMActionDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct IAMActionsDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: IAMActionsEmbeddedDTO,
}

impl From<(Vec<IAMAction>, HALPage)> for IAMActionsDTO {
	fn from((iam_actions, page): (Vec<IAMAction>, HALPage)) -> Self {
		Self {
			_links: HALLinkList::from(("/api/v1/iam-actions".to_owned(), &page)),
			_embedded: IAMActionsEmbeddedDTO {
				iam_actions: iam_actions
					.iter()
					.map(|iam_action| IAMActionDTO::from(iam_action.clone()))
					.collect(),
			},
			_page: page,
		}
	}
}
