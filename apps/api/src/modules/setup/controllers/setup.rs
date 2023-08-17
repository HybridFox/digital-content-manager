use super::super::dto::request;
use crate::modules::auth::dto::response::MeDTO;
use crate::modules::auth::helpers::permissions::get_user_permissions;
use crate::modules::{core::middleware::state::AppState, setup::services::setup::setup_initial_user};
use crate::utils::api::ApiResponse;
use actix_web::{post, web, HttpResponse};

#[utoipa::path(
	context_path = "/api/v1/setup",
    request_body = RegisterUserDTO,
	responses(
		(status = 200, body = AuthDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	)
)]
#[post("/register")]
pub async fn register(
	state: web::Data<AppState>,
	form: web::Json<request::SetupInstanceDTO>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;

	let (user, token) =
		setup_initial_user(conn, &form.email, &form.name, &form.password, None, None).await?;
	let permissions = get_user_permissions(conn, user.id, None)?;

	let res = MeDTO::from((user, token, permissions));
	Ok(HttpResponse::Ok().json(res))
}
