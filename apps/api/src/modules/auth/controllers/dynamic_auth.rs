use super::super::dto::request;
use crate::errors::AppError;
use crate::modules::auth::services::dynamic_login::get_auth_provider;
use crate::modules::core::middleware::state::AppState;
use crate::utils::api::ApiResponse;
use actix_web::{post, web, HttpResponse};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams, Debug)]
pub struct LoginPathParams {
	pub auth_id: Uuid,
}

#[derive(Deserialize, IntoParams, Debug)]
pub struct LoginQueryParams {
	pub code: String,
}

#[utoipa::path(
	context_path = "/api/v1/auth/{auth_id}",
    request_body = LoginUserDTO,
	responses(
		(status = 200, body = AuthDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	)
)]
#[post("/login")]
pub async fn login(
	state: web::Data<AppState>,
	form: web::Json<request::LoginUserDTO>,
	params: web::Path<LoginPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let auth_provider = get_auth_provider(conn, params.auth_id)?;

	Ok(auth_provider.login(conn, form.0).await?)
}

#[utoipa::path(
	context_path = "/api/v1/auth/{auth_id}",
    request_body = RegisterUserDTO,
	responses(
		(status = 200, body = AuthDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	)
)]
#[post("/callback")]
pub async fn callback(
	state: web::Data<AppState>,
	params: web::Path<LoginPathParams>,
	query: web::Query<LoginQueryParams>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	let auth_provider = get_auth_provider(conn, params.auth_id)?;

	Ok(auth_provider.callback(conn, query.code.clone()).await?)
}
