use crate::modules::{
	core::models::hal::{HALLinkList, HALPage},
	iam_conditions::models::iam_condition::IAMCondition,
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use std::convert::From;
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct IAMConditionDTO {
	pub key: String,
	pub description: Option<String>,
	pub active: bool,
	pub deprecated: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<IAMCondition> for IAMConditionDTO {
	fn from(condition: IAMCondition) -> Self {
		Self {
			key: condition.key,
			description: condition.description,
			active: condition.active,
			deprecated: condition.deprecated,
			created_at: condition.created_at,
			updated_at: condition.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct IAMConditionsEmbeddedDTO {
	pub iam_conditions: Vec<IAMConditionDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct IAMConditionsDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: IAMConditionsEmbeddedDTO,
}

impl From<(Vec<IAMCondition>, HALPage)> for IAMConditionsDTO {
	fn from((iam_conditions, page): (Vec<IAMCondition>, HALPage)) -> Self {
		Self {
			_links: HALLinkList::from(("/api/v1/iam-conditions".to_owned(), &page)),
			_embedded: IAMConditionsEmbeddedDTO {
				iam_conditions: iam_conditions
					.iter()
					.map(|iam_condition| IAMConditionDTO::from(iam_condition.clone()))
					.collect(),
			},
			_page: page,
		}
	}
}
