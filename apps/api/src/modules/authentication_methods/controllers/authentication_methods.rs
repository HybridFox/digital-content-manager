use super::super::dto::authentication_methods::{request, response};
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::authentication_methods::models::authentication_method::{
	CreateAuthenticationMethod, UpdateAuthenticationMethod,
};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use crate::{
	errors::AppError,
	modules::authentication_methods::models::authentication_method::AuthenticationMethod,
};
use actix_web::{delete, get, post, put, web, HttpRequest, HttpResponse};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindOnePathParams {
	authentication_method_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
	all: Option<bool>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/authentication_methods",
    request_body = CreateAuthenticationMethodDTO,
	responses(
		(status = 200, body = AuthenticationMethodDTO),
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
	form: web::Json<request::CreateAuthenticationMethodDTO>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		None,
		format!("urn:dcm:authentication-methods:*"),
		"root::authentication-methods:create",
	)?;
	let conn = &mut state.get_conn()?;
	let authentication_method = AuthenticationMethod::create(
		conn,
		CreateAuthenticationMethod {
			name: form.name.clone(),
			kind: form.kind.clone(),
			configuration: form.configuration.clone(),
			weight: form.weight.clone(),
			active: form.active.clone(),
		},
	)?;
	let res = response::AuthenticationMethodDTO::from(authentication_method);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/authentication_methods",
	responses(
		(status = 200, body = AuthenticationMethodsDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindAllQueryParams)
)]
#[get("")]
pub async fn find_all(
	state: web::Data<AppState>,
	query: web::Query<FindAllQueryParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);

	let (authentication_methods, total_elements) =
		AuthenticationMethod::find(conn, page, pagesize, query.all)?;

	let res = response::AuthenticationMethodsDTO::from((
		authentication_methods,
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
		(status = 200, body = AuthenticationMethodDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[get("/{authentication_method_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		None,
		format!(
			"urn:dcm:authentication-methods:{}",
			params.authentication_method_id
		),
		"root::authentication-methods:read",
	)?;
	let conn = &mut state.get_conn()?;
	let authentication_method =
		AuthenticationMethod::find_one(conn, params.authentication_method_id)?;

	let res = response::AuthenticationMethodDTO::from(authentication_method);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/authentication_methods",
    request_body = UpdateAuthenticationMethodDTO,
	responses(
		(status = 200, body = SiteDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[put("/{authentication_method_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateAuthenticationMethodDTO>,
) -> ApiResponse {
	ensure_permission(
		&req,
		None,
		format!(
			"urn:dcm:authentication-methods:{}",
			params.authentication_method_id
		),
		"root::authentication-methods:update",
	)?;
	let conn = &mut state.get_conn()?;
	let authentication_method = AuthenticationMethod::update(
		conn,
		params.authentication_method_id,
		UpdateAuthenticationMethod {
			name: form.name.clone(),
			configuration: form.configuration.clone(),
			weight: form.weight.clone(),
			active: form.active.clone(),
		},
	)?;
	let res = response::AuthenticationMethodDTO::from(authentication_method);
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
#[delete("/{authentication_method_id}")]
pub async fn remove(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	ensure_permission(
		&req,
		None,
		format!(
			"urn:dcm:authentication-methods:{}",
			params.authentication_method_id
		),
		"root::authentication-methods:remove",
	)?;
	let conn = &mut state.get_conn()?;
	AuthenticationMethod::remove(conn, params.authentication_method_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
