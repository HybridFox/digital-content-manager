use super::super::dto::directories::{request, response};
use crate::modules::resources::engines::lib::get_storage_engine;
use crate::errors::AppError;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use actix_web::{get, post, web, delete, HttpResponse};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct SharedParams {
	site_id: Uuid,
	storage_repository_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct ResourcesQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
	path: String,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/storage-repositories/{storage_repository_id}/directories",
	responses(
		(status = 200, body = ResourcesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(SharedParams, ResourcesQueryParams)
)]
#[get("")]
pub async fn read_directory(
	state: web::Data<AppState>,
	query: web::Query<ResourcesQueryParams>,
	params: web::Path<SharedParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let engine = get_storage_engine(conn, params.storage_repository_id)?;

	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);

	let (resources, total_elements) = engine.find_all(&query.path).await?;

	let res = response::ResourcesDTO::from((
		resources,
		HALPage {
			number: page,
			size: pagesize,
			total_elements,
			total_pages: (total_elements / pagesize + (total_elements % pagesize).signum()).max(1),
		},
		params.site_id,
		params.storage_repository_id,
	));

	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/storage-repositories/{storage_repository_id}/directories",
	responses(
		(status = 200, body = ResourcesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(SharedParams, ResourcesQueryParams)
)]
#[post("")]
pub async fn create_directory(
	state: web::Data<AppState>,
	query: web::Query<ResourcesQueryParams>,
	form: web::Json<request::CreateDirectoryDTO>,
	params: web::Path<SharedParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let engine = get_storage_engine(conn, params.storage_repository_id)?;
	engine.create_directory(&query.path, &form.name).await?;

	Ok(HttpResponse::NoContent().finish())
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/storage-repositories/{storage_repository_id}/directories",
	responses(
		(status = 200, body = ResourcesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(SharedParams, ResourcesQueryParams)
)]
#[delete("")]
pub async fn remove_directory(
	state: web::Data<AppState>,
	query: web::Query<ResourcesQueryParams>,
	params: web::Path<SharedParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let engine = get_storage_engine(conn, params.storage_repository_id)?;
	engine.remove_directory(&query.path).await?;

	Ok(HttpResponse::NoContent().finish())
}
