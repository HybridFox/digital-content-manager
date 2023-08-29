use super::super::dto::authentication_method_roles::{request, response};
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::authentication_methods::models::authentication_method_role::{
	CreateAuthenticationMethodRole, UpdateAuthenticationMethodRole,
};
use crate::{
	errors::AppError,
	modules::authentication_methods::models::authentication_method_role::AuthenticationMethodRole,
};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, delete, put, HttpRequest};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindOnePathParams {
	authentication_method_id: Uuid,
	authentication_method_role_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	authentication_method_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/authentication_methods",
    request_body = CreateAuthenticationMethodRoleDTO,
	responses(
		(status = 200, body = AuthenticationMethodRoleDTO),
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
	form: web::Json<request::CreateAuthenticationMethodRoleDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		None,
		format!(
			"urn:ibs:authentication-methods:{}",
			params.authentication_method_id
		),
		"root::authentication-methods:update",
	)?;
	let conn = &mut state.get_conn()?;
	let authentication_method_role = AuthenticationMethodRole::create(
		conn,
		CreateAuthenticationMethodRole {
			authentication_method_id: params.authentication_method_id,
			site_id: form.site_id,
			role_id: form.role_id,
		},
	)?;
	let res = response::AuthenticationMethodRoleDTO::from(authentication_method_role);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/authentication_methods",
	responses(
		(status = 200, body = AuthenticationMethodRolesDTO),
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
		None,
		format!(
			"urn:ibs:authentication-methods:{}",
			params.authentication_method_id
		),
		"root::authentication-methods:update",
	)?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(10);

	let (authentication_method_roles, total_elements) =
		AuthenticationMethodRole::find(conn, params.authentication_method_id, page, pagesize)?;

	let res = response::AuthenticationMethodRolesDTO::from((
		authentication_method_roles,
		HALPage {
			number: page,
			size: pagesize,
			total_elements,
			total_pages: (total_elements / pagesize + (total_elements % pagesize).signum()).max(1),
		},
	));

	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/authentication_methods",
	responses(
		(status = 200, body = AuthenticationMethodRoleDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[get("/{authentication_method_role_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		None,
		format!(
			"urn:ibs:authentication-methods:{}",
			params.authentication_method_id
		),
		"root::authentication-methods:update",
	)?;
	let conn = &mut state.get_conn()?;
	let authentication_method_role =
		AuthenticationMethodRole::find_one(conn, params.authentication_method_role_id)?;

	let res = response::AuthenticationMethodRoleDTO::from(authentication_method_role);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/authentication_methods",
    request_body = UpdateAuthenticationMethodRoleDTO,
	responses(
		(status = 200, body = SiteDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[put("/{authentication_method_role_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateAuthenticationMethodRoleDTO>,
) -> ApiResponse {
	ensure_permission(
		&req,
		None,
		format!(
			"urn:ibs:authentication-methods:{}",
			params.authentication_method_id
		),
		"root::authentication-methods:update",
	)?;
	let conn = &mut state.get_conn()?;
	let authentication_method_role = AuthenticationMethodRole::update(
		conn,
		params.authentication_method_role_id,
		UpdateAuthenticationMethodRole {
			role_id: form.role_id,
		},
	)?;
	let res = response::AuthenticationMethodRoleDTO::from(authentication_method_role);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/authentication_methods",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[delete("/{authentication_method_role_id}")]
pub async fn remove(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	ensure_permission(
		&req,
		None,
		format!(
			"urn:ibs:authentication-methods:{}",
			params.authentication_method_id
		),
		"root::authentication-methods:update",
	)?;
	let conn = &mut state.get_conn()?;
	AuthenticationMethodRole::remove(conn, params.authentication_method_role_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
