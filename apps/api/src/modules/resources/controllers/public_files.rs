use crate::errors::AppError;
use crate::modules::core::middleware::state::AppState;
use crate::modules::resources::engines::lib::get_storage_engine;
use actix_web::{get, web, HttpResponse};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
#[serde(rename_all = "camelCase")]
pub struct FilesQueryParams {
	path: String,
	storage_repository_id: Uuid,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/files",
    request_body = CreateAssetDTO,
	responses(
		(status = 200, body = AssetDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[get("")]
pub async fn read_file(
	state: web::Data<AppState>,
	query: web::Query<FilesQueryParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let engine = get_storage_engine(conn, query.storage_repository_id)?;
	let file = engine.download_file(&query.path).await?;

	Ok(HttpResponse::Ok().body(file))
}
