use crate::modules::{
	auth::models::user::User,
	sites::{dto::response::SiteWithRolesDTO, models::{site::Site, language::Language}},
	roles::models::role::Role,
	iam_policies::models::{iam_policy::IAMPolicy, permission::Permission},
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
		String,
	)> for AuthDTO
{
	fn from(
		(user, sites, token): (
			User,
			Vec<(
				Site,
				Vec<(Role, Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)>)>,
				Vec<Language>
			)>,
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
		}
	}
}
