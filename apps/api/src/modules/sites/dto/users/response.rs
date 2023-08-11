use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::modules::{auth::models::user::User, core::models::hal::{HALLinkList, HALPage}, roles::{models::role::Role, dto::response::RoleDTO}};

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
	roles: Vec<RoleDTO>
}

impl From<(User, Vec<Role>)> for UserWithRolesDTO {
	fn from((user, roles): (User, Vec<Role>)) -> Self {
		Self {
			id: user.id,
			email: user.email,
			name: user.name,
			roles: roles.into_iter().map(RoleDTO::from).collect()
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UsersEmbeddedDTO {
	pub users: Vec<UserWithRolesDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UsersDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: UsersEmbeddedDTO,
}

impl From<(Vec<(User, Vec<Role>)>, HALPage, Uuid)> for UsersDTO {
	fn from((users, page, site_id): (Vec<(User, Vec<Role>)>, HALPage, Uuid)) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{site_id}/users"), &page)),
			_embedded: UsersEmbeddedDTO {
				users: users
					.into_iter()
					.map(|user| UserWithRolesDTO::from(user))
					.collect(),
			},
			_page: page,
		}
	}
}
