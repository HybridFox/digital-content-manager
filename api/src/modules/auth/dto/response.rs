use crate::modules::auth::models::user::User;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use std::convert::From;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UserDTO {
	pub email: String,
	pub token: String,
	pub name: String,
	pub bio: Option<String>,
	pub image: Option<String>,
}

impl From<(User, String)> for UserDTO {
	fn from((user, token): (User, String)) -> Self {
		Self {
			email: user.email,
			token,
			name: user.name,
			bio: user.bio,
			image: user.image,
		}
	}
}
