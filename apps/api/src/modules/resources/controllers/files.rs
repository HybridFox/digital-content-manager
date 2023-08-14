use crate::modules::resources::dto::files::request;
use crate::modules::resources::engines::lib::get_storage_engine;
use crate::errors::AppError;
use crate::modules::core::middleware::state::AppState;
use actix_multipart::form::MultipartForm;
use actix_web::{get, post, web, delete, HttpResponse};
use super::super::engines::lib::StorageEngine;
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct SharedParams {
	site_id: Uuid,
	storage_repository_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FilesQueryParams {
	path: String,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/storage-repositories/{storage_repository_id}/files",
    request_body = CreateAssetDTO,
	responses(
		(status = 200, body = AssetDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[post("")]
pub async fn upload_file(
	state: web::Data<AppState>,
	MultipartForm(form): MultipartForm<request::CreateFileDTO>,
	query: web::Query<FilesQueryParams>,
	params: web::Path<SharedParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let engine = get_storage_engine(conn, params.storage_repository_id)?;
	engine.upload_file(&query.path, form.file).await?;

	Ok(HttpResponse::NoContent().finish())
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/storage-repositories/{storage_repository_id}/files",
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
	params: web::Path<SharedParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let engine = get_storage_engine(conn, params.storage_repository_id)?;
	let file = engine.download_file(&query.path).await?;

	Ok(HttpResponse::Ok().body(file))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/storage-repositories/{storage_repository_id}/files",
    request_body = CreateAssetDTO,
	responses(
		(status = 200, body = AssetDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[delete("")]
pub async fn remove_file(
	state: web::Data<AppState>,
	query: web::Query<FilesQueryParams>,
	params: web::Path<SharedParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let engine = get_storage_engine(conn, params.storage_repository_id)?;
	engine.remove_file(&query.path).await?;

	Ok(HttpResponse::NoContent().finish())
}
