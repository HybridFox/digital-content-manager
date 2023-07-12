use super::super::models::user::{User};
use super::super::dto::{request, response};
use crate::errors::{AppError};
use crate::modules::auth::services::register::register_user;
use crate::modules::core::middleware::state::AppState;
use crate::utils::api::ApiResponse;
use actix_web::{post, web, HttpResponse};

#[utoipa::path(
	context_path = "/api/v1/auth/local",
    request_body = LoginUserDTO,
	responses(
		(status = 200, body = UserDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	)
)]
#[post("/login")]
pub async fn login(
	state: web::Data<AppState>,
	form: web::Json<request::LoginUserDTO>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let (user, token) = User::signin_local(conn, &form.email, &form.password)?;
	let res = response::UserDTO::from((user, token));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/auth/local",
    request_body = RegisterUserDTO,
	responses(
		(status = 200, body = UserDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	)
)]
#[post("/register")]
pub async fn register(
	state: web::Data<AppState>,
	form: web::Json<request::RegisterUserDTO>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;

	let (user, token) =
		register_user(conn, &form.email, &form.name, &form.password, None, None).await?;

	let res = response::UserDTO::from((user, token));
	Ok(HttpResponse::Ok().json(res))
}
