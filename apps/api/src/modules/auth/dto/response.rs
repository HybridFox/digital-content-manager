use crate::modules::{
	auth::models::user::User,
	sites::{dto::response::SiteWithRolesDTO, models::site::Site},
	roles::{models::role::Role, dto::response::RoleWithPoliciesWithPermissionsDTO},
	iam_policies::models::{iam_policy::IAMPolicy, permission::Permission}, languages::models::language::Language,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use std::convert::From;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UserDTO {
	pub email: String,
	pub name: String,
	pub bio: Option<String>,
	pub avatar: Option<String>,
}

impl From<User> for UserDTO {
	fn from(user: User) -> Self {
		Self {
			email: user.email,
			name: user.name,
			bio: user.bio,
			avatar: user.avatar,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct AuthDTO {
	pub sites: Vec<SiteWithRolesDTO>,
	pub roles: Vec<RoleWithPoliciesWithPermissionsDTO>,
	pub user: UserDTO,
	pub token: String,
}

impl
	From<(
		User,
		Vec<(
			Site,
			Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)>,
			Vec<Language>
		)>,
		Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)>,
		String,
	)> for AuthDTO
{
	fn from(
		(user, sites, roles, token): (
			User,
			Vec<(
				Site,
				Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)>,
				Vec<Language>
			)>,
			Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)>,
			String,
		),
	) -> Self {
		Self {
			token,
			user: UserDTO::from(user),
			sites: sites
				.into_iter()
				.map(|site| SiteWithRolesDTO::from(site))
				.collect(),
			roles: roles
				.into_iter()
				.map(|role| RoleWithPoliciesWithPermissionsDTO::from(role))
				.collect(),
		}
	}
}
