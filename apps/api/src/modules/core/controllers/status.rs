use std::env;

use actix_web::{HttpResponse, get};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::{constants::env_key, utils::api::ApiResponse};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct StatusDTO {
	pub version: String,
}

impl From<String> for StatusDTO {
	fn from(version: String) -> Self {
		Self { version }
	}
}

#[utoipa::path(
	context_path = "/api/v1/status",
	responses(
		(status = 200, body = StatusDTO)
	)
)]
#[get("")]
pub async fn ping() -> ApiResponse {
	let res = StatusDTO::from(env::var(env_key::VERSION).unwrap_or("0".to_owned()));
	Ok(HttpResponse::Ok().json(res))
}
