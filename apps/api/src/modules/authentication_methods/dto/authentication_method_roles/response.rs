use crate::modules::{
	authentication_methods::models::authentication_method_role::AuthenticationMethodRole,
	core::models::hal::{HALLinkList, HALPage},
	roles::{dto::response::RoleDTO, models::role::Role},
	sites::{dto::response::SiteDTO, models::site::Site},
};
use serde::{Deserialize, Serialize};
use std::convert::From;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct AuthenticationMethodRoleDTO {
	pub id: Uuid,
	pub role_id: Uuid,
	pub site_id: Option<Uuid>,
	pub role: RoleDTO,
	pub site: Option<SiteDTO>,
}

impl From<(AuthenticationMethodRole, Role, Option<Site>)> for AuthenticationMethodRoleDTO {
	fn from(
		(authentication_method, role, site): (AuthenticationMethodRole, Role, Option<Site>),
	) -> Self {
		Self {
			id: authentication_method.id,
			site_id: authentication_method.site_id,
			role_id: authentication_method.role_id,
			role: RoleDTO::from(role),
			site: if site.is_some() {
				Some(SiteDTO::from(site.unwrap()))
			} else {
				None
			},
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct AuthenticationMethodRolesEmbeddedDTO {
	pub authentication_method_role_assignments: Vec<AuthenticationMethodRoleDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct AuthenticationMethodRolesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: AuthenticationMethodRolesEmbeddedDTO,
}

impl From<(Vec<(AuthenticationMethodRole, Role, Option<Site>)>, HALPage)>
	for AuthenticationMethodRolesDTO
{
	fn from(
		(authentication_method_role_assignments, page): (
			Vec<(AuthenticationMethodRole, Role, Option<Site>)>,
			HALPage,
		),
	) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/authentication-methods"), &page)),
			_embedded: AuthenticationMethodRolesEmbeddedDTO {
				authentication_method_role_assignments: authentication_method_role_assignments
					.into_iter()
					.map(AuthenticationMethodRoleDTO::from)
					.collect(),
			},
			_page: page,
		}
	}
}
