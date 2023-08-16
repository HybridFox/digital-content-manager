use crate::modules::{
	core::models::hal::{HALLinkList, HALPage},
	authentication_methods::models::authentication_method::AuthenticationMethod,
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use utoipa::ToSchema;
use uuid::Uuid;
use std::convert::From;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct AuthenticationMethodDTO {
	pub id: Uuid,
	pub name: String,
	pub kind: String,
	pub configuration: Option<Value>,
	pub weight: i32,
	pub active: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<AuthenticationMethod> for AuthenticationMethodDTO {
	fn from(authentication_method: AuthenticationMethod) -> Self {
		Self {
			id: authentication_method.id,
			name: authentication_method.name,
			kind: authentication_method.kind,
			configuration: authentication_method.configuration,
			weight: authentication_method.weight,
			active: authentication_method.active,
			created_at: authentication_method.created_at,
			updated_at: authentication_method.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct MinimalAuthenticationMethodDTO {
	pub id: Uuid,
	pub name: String,
	pub kind: String,
	pub weight: i32,
	pub active: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<AuthenticationMethod> for MinimalAuthenticationMethodDTO {
	fn from(authentication_method: AuthenticationMethod) -> Self {
		Self {
			id: authentication_method.id,
			name: authentication_method.name,
			kind: authentication_method.kind,
			weight: authentication_method.weight,
			active: authentication_method.active,
			created_at: authentication_method.created_at,
			updated_at: authentication_method.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct AuthenticationMethodsEmbeddedDTO {
	pub authentication_methods: Vec<MinimalAuthenticationMethodDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct AuthenticationMethodsDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: AuthenticationMethodsEmbeddedDTO,
}

impl From<(Vec<AuthenticationMethod>, HALPage)> for AuthenticationMethodsDTO {
	fn from((authentication_methods, page): (Vec<AuthenticationMethod>, HALPage)) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/authentication-methods"), &page)),
			_embedded: AuthenticationMethodsEmbeddedDTO {
				authentication_methods: authentication_methods
					.into_iter()
					.map(MinimalAuthenticationMethodDTO::from)
					.collect(),
			},
			_page: page,
		}
	}
}
