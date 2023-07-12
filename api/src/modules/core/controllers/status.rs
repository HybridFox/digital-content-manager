use actix_web::{HttpResponse, get};

use crate::utils::api::ApiResponse;

#[utoipa::path(
	context_path = "/api/v1/status",
	responses(
		(status = 200, body = String)
	)
)]
#[get("/ping")]
pub async fn ping() -> ApiResponse {
	Ok(HttpResponse::Ok().body("pong"))
}
