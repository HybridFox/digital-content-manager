use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::modules::{
	authentication_methods::{
		dto::authentication_methods::response::AuthenticationMethodDTO,
		models::authentication_method::AuthenticationMethod,
	},
	core::models::hal::{HALLinkList, HALPage},
	iam_policies::models::{iam_policy::IAMPolicy, permission::Permission},
	languages::models::language::Language,
	roles::{dto::response::RoleDTO, models::role::Role},
	sites::{dto::response::SiteWithRolesDTO, models::site::Site},
	users::models::user::User,
};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UserDTO {
	id: Uuid,
	email: String,
	name: String,
}

impl From<User> for UserDTO {
	fn from(user: User) -> Self {
		Self {
			id: user.id,
			email: user.email,
			name: user.name,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UserWithRolesDTO {
	id: Uuid,
	email: String,
	name: String,
	roles: Vec<RoleDTO>,
}

impl From<(User, Vec<Role>)> for UserWithRolesDTO {
	fn from((user, roles): (User, Vec<Role>)) -> Self {
		Self {
			id: user.id,
			email: user.email,
			name: user.name,
			roles: roles.into_iter().map(RoleDTO::from).collect(),
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UserWithAuthMethodAndRolesDTO {
	id: Uuid,
	email: String,
	name: String,
	roles: Vec<RoleDTO>,
	authentication_method: AuthenticationMethodDTO,
}

impl From<(User, AuthenticationMethod, Vec<Role>)> for UserWithAuthMethodAndRolesDTO {
	fn from((user, auth_method, roles): (User, AuthenticationMethod, Vec<Role>)) -> Self {
		Self {
			id: user.id,
			email: user.email,
			name: user.name,
			roles: roles.into_iter().map(RoleDTO::from).collect(),
			authentication_method: AuthenticationMethodDTO::from(auth_method),
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UsersEmbeddedDTO {
	pub users: Vec<UserWithAuthMethodAndRolesDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UsersDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: UsersEmbeddedDTO,
}

impl From<(Vec<(User, AuthenticationMethod, Vec<Role>)>, HALPage, Uuid)> for UsersDTO {
	fn from(
		(users, page, site_id): (Vec<(User, AuthenticationMethod, Vec<Role>)>, HALPage, Uuid),
	) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{site_id}/users"), &page)),
			_embedded: UsersEmbeddedDTO {
				users: users
					.into_iter()
					.map(|user| UserWithAuthMethodAndRolesDTO::from(user))
					.collect(),
			},
			_page: page,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SitesWithRolesEmbeddedDTO {
	pub sites: Vec<SiteWithRolesDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SitesWithRolesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: SitesWithRolesEmbeddedDTO,
}

impl
	From<(
		Vec<(
			Site,
			Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)>,
			Vec<Language>,
		)>,
		HALPage,
		Uuid,
	)> for SitesWithRolesDTO
{
	fn from(
		(sites, page, user_id): (
			Vec<(
				Site,
				Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)>,
				Vec<Language>,
			)>,
			HALPage,
			Uuid,
		),
	) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/users/{user_id}/sites"), &page)),
			_embedded: SitesWithRolesEmbeddedDTO {
				sites: sites
					.into_iter()
					.map(|site| SiteWithRolesDTO::from(site))
					.collect(),
			},
			_page: page,
		}
	}
}
