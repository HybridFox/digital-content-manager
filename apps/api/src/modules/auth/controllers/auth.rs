use crate::modules::auth::dto::request;
use crate::modules::users::models::user::{User, UpdateUser};
use crate::modules::{core::middleware::auth, auth::dto::response};
use crate::modules::core::middleware::state::AppState;
use crate::utils::api::ApiResponse;
use actix_web::{get, web, HttpRequest, HttpResponse, put};

#[utoipa::path(
	context_path = "/api/v1/auth",
	responses(
		(status = 200, body = AuthDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[get("/me")]
pub async fn me(state: web::Data<AppState>, req: HttpRequest) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	let user = auth::get_current_user(&req)?;
	let token = user.generate_token()?;
	let sites = user.get_sites(conn)?;
	let roles = user.get_roles(conn)?;
	let res = response::AuthDTO::from((user, sites, roles, token));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/auth",
    request_body = UpdateUserDTO,
	responses(
		(status = 200, body = AuthDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[put("/me")]
pub async fn update(
	state: web::Data<AppState>,
	req: HttpRequest,
	form: web::Json<request::UpdateUserDTO>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	let current_user = auth::get_current_user(&req)?;
	let user = User::update(
		conn,
		current_user.id,
		UpdateUser {
			email: form.email.clone(),
			name: form.name.clone(),
			password: form.password.clone(),
			avatar: form.avatar.clone(),
			bio: form.bio.clone(),
		},
	)?;
	let token = user.generate_token()?;
	let sites = user.get_sites(conn)?;
	let roles = user.get_roles(conn)?;
	let res = response::AuthDTO::from((user, sites, roles, token));
	Ok(HttpResponse::Ok().json(res))
}
