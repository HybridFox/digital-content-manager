use crate::modules::{
	iam_policies::models::{iam_policy::IAMPolicy, permission::Permission},
	core::models::hal::{HALLinkList, HALPage},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::{ToSchema};
use uuid::Uuid;
use std::{convert::From};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct PermissionDTO {
	resources: Vec<String>,
	effect: String,
	actions: Vec<String>,
}

impl From<(Permission, Vec<String>)> for PermissionDTO {
	fn from((permission, actions): (Permission, Vec<String>)) -> Self {
		Self {
			resources: permission.resources.into(),
			effect: permission.effect,
			actions,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct IAMPolicyDTO {
	pub id: Uuid,
	pub name: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<IAMPolicy> for IAMPolicyDTO {
	fn from(policy: IAMPolicy) -> Self {
		Self {
			id: policy.id,
			name: policy.name,
			created_at: policy.created_at,
			updated_at: policy.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct IAMPolicyWithPermissionsDTO {
	pub id: Uuid,
	pub name: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
	pub permissions: Vec<PermissionDTO>,
}

impl From<(IAMPolicy, Vec<(Permission, Vec<String>)>)> for IAMPolicyWithPermissionsDTO {
	fn from((policy, permissions): (IAMPolicy, Vec<(Permission, Vec<String>)>)) -> Self {
		Self {
			id: policy.id,
			name: policy.name,
			created_at: policy.created_at,
			updated_at: policy.updated_at,
			permissions: permissions
				.into_iter()
				.map(|permission| PermissionDTO::from(permission))
				.collect(),
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct IAMPoliciesEmbeddedDTO {
	pub policies: Vec<IAMPolicyWithPermissionsDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct IAMPoliciesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: IAMPoliciesEmbeddedDTO,
}

impl
	From<(
		Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>,
		HALPage,
		Uuid,
	)> for IAMPoliciesDTO
{
	fn from(
		(policies, page, team_id): (
			Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>,
			HALPage,
			Uuid,
		),
	) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/teams/{}/policies", team_id), &page)),
			_embedded: IAMPoliciesEmbeddedDTO {
				policies: policies
					.into_iter()
					.map(|(policy, permissions)| {
						IAMPolicyWithPermissionsDTO::from((policy, permissions))
					})
					.collect(),
			},
			_page: page,
		}
	}
}
