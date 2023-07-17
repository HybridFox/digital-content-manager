use crate::modules::{
	roles::models::role::Role,
	core::models::hal::{HALLinkList, HALPage},
	iam_policies::{models::{iam_policy::IAMPolicy, permission::Permission}, dto::response::{IAMPolicyDTO, IAMPolicyWithPermissionsDTO}},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use std::convert::From;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct RoleDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<Role> for RoleDTO {
	fn from(role: Role) -> Self {
		Self {
			id: role.id,
			name: role.name,
			slug: role.slug,
			created_at: role.created_at,
			updated_at: role.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct RoleWithPoliciesDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub policies: Vec<IAMPolicyDTO>,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<(Role, Vec<IAMPolicy>)> for RoleWithPoliciesDTO {
	fn from((role, policies): (Role, Vec<IAMPolicy>)) -> Self {
		Self {
			id: role.id,
			name: role.name,
			slug: role.slug,
			created_at: role.created_at,
			updated_at: role.updated_at,
			policies: policies.into_iter().map(IAMPolicyDTO::from).collect(),
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct RoleWithPoliciesWithPermissionsDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub policies: Vec<IAMPolicyWithPermissionsDTO>,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)> for RoleWithPoliciesWithPermissionsDTO {
	fn from((role, policies): (Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)) -> Self {
		Self {
			id: role.id,
			name: role.name,
			slug: role.slug,
			created_at: role.created_at,
			updated_at: role.updated_at,
			policies: policies.into_iter().map(|policy| IAMPolicyWithPermissionsDTO::from(policy)).collect(),
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct RolesEmbeddedDTO {
	pub roles: Vec<RoleDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct RolesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: RolesEmbeddedDTO,
}

impl From<(Vec<Role>, HALPage, Uuid)> for RolesDTO {
	fn from((roles, page, site_id): (Vec<Role>, HALPage, Uuid)) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{}/roles", site_id), &page)),
			_embedded: RolesEmbeddedDTO {
				roles: roles
					.iter()
					.map(|role| RoleDTO::from(role.clone()))
					.collect(),
			},
			_page: page,
		}
	}
}
