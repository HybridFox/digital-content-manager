use super::super::dto::modules::{request, response};
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::modules::models::module::{CreateModule, UpdateModule};
use crate::{errors::AppError, modules::modules::models::module::Module};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, delete, put, HttpRequest};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindOnePathParams {
	site_id: Uuid,
	module_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	site_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
	all: Option<bool>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/modules",
    request_body = CreateModuleDTO,
	responses(
		(status = 200, body = ModuleDTO),
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
	form: web::Json<request::CreateModuleDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:modules:*"),
		"sites::modules:create",
	)?;
	let conn = &mut state.get_conn()?;
	let module = Module::create(
		conn,
		CreateModule {
			name: form.name.clone(),
			entry_url: form.entry_url.clone(),
			active: form.active.clone(),
			site_id: params.site_id,
		},
	)?;
	let res = response::ModuleDTO::from(module);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/modules",
	responses(
		(status = 200, body = ModulesDTO),
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
		format!("urn:dcm:webooks:*"),
		"sites::webooks:read",
	)?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);

	let (modules, total_elements) = Module::find(conn, params.site_id, page, pagesize, query.all)?;

	let res = response::ModulesDTO::from((
		modules,
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
	context_path = "/api/v1/sites/{site_id}/modules",
	responses(
		(status = 200, body = ModuleDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[get("/{module_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:webooks:*"),
		"sites::webooks:read",
	)?;
	let conn = &mut state.get_conn()?;
	let module = Module::find_one(conn, params.module_id)?;

	let res = response::ModuleDTO::from(module);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/modules",
    request_body = UpdateModuleDTO,
	responses(
		(status = 200, body = SiteDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[put("/{module_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateModuleDTO>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:modules:{}", params.module_id),
		"sites::modules:update",
	)?;
	let conn = &mut state.get_conn()?;
	let module = Module::update(
		conn,
		params.module_id,
		UpdateModule {
			name: form.name.clone(),
			entry_url: form.entry_url.clone(),
			active: form.active.clone(),
		},
	)?;
	let res = response::ModuleDTO::from(module);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/modules",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[delete("/{module_id}")]
pub async fn remove(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:modules:{}", params.module_id),
		"sites::workflows:remove",
	)?;
	let conn = &mut state.get_conn()?;
	Module::remove(conn, params.module_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
