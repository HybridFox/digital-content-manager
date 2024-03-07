use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::resources::dto::storage_repositories::{response, request};
use crate::modules::resources::models::storage_repository::{
	CreateStorageRepository, StorageRepository, UpdateStorageRepository,
};
use crate::errors::AppError;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use actix_web::{get, post, web, put, delete, HttpResponse, HttpRequest};
use chrono::Utc;
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	site_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindOnePathParams {
	site_id: Uuid,
	storage_repository_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/assets",
    request_body = CreateStorageRepositoryDTO,
	responses(
		(status = 200, body = StorageRepositoryDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[post("")]
pub async fn create(
	req: HttpRequest,
	state: web::Data<AppState>,
	form: web::Json<request::CreateStorageRepositoryDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:storage-repositories:*"),
		"sites::storage-repositories:create",
	)?;
	let conn = &mut state.get_conn()?;

	let storage_repository = StorageRepository::create(
		conn,
		CreateStorageRepository {
			name: &form.name,
			kind: &form.kind,
			configuration: form.configuration.clone(),
		},
	)?;

	let res = response::StorageRepositoryDTO::from(storage_repository);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/assets",
	responses(
		(status = 200, body = StorageRepositoriesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindAllQueryParams)
)]
#[get("")]
pub async fn find_all(
	req: HttpRequest,
	state: web::Data<AppState>,
	query: web::Query<FindAllQueryParams>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:storage-repositories:*"),
		"sites::storage-repositories:read",
	)?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(10);

	let (storage_repositories, total_elements) =
		StorageRepository::find(conn, params.site_id, page, pagesize)?;

	let res = response::StorageRepositoriesDTO::from((
		storage_repositories,
		HALPage {
			number: page,
			size: pagesize,
			total_elements,
			total_pages: (total_elements / pagesize + (total_elements % pagesize).signum()).max(1),
		},
		params.site_id,
	));

	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/assets",
	responses(
		(status = 200, body = StorageRepositoryDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{storage_repository_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!(
			"urn:dcm:storage-repositories:{}",
			params.storage_repository_id
		),
		"sites::storage-repositories:read",
	)?;
	let conn = &mut state.get_conn()?;
	let storage_repository = StorageRepository::find_one(conn, params.storage_repository_id)?;

	let res = response::StorageRepositoryDTO::from(storage_repository);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/storage-repositories",
    request_body = UpdateContentDTO,
	responses(
		(status = 200, body = ContentWithFieldsDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{storage_repository_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateStorageRepositoryDTO>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!(
			"urn:dcm:storage-repositories:{}",
			params.storage_repository_id
		),
		"sites::storage-repositories:update",
	)?;
	let conn = &mut state.get_conn()?;
	let storage_repository = StorageRepository::update(
		conn,
		params.storage_repository_id,
		UpdateStorageRepository {
			name: form.name.clone(),
			configuration: form.configuration.clone(),
			updated_at: Utc::now().naive_utc(),
		},
	)?;
	let res = response::StorageRepositoryDTO::from(storage_repository);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/storage-repositories",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[delete("/{storage_repository_id}")]
pub async fn remove(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!(
			"urn:dcm:storage-repositories:{}",
			params.storage_repository_id
		),
		"sites::storage-repositories:remove",
	)?;
	let conn = &mut state.get_conn()?;
	StorageRepository::remove(conn, params.storage_repository_id)?;
	Ok(HttpResponse::NoContent().finish())
}
