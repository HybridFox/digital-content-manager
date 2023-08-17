use super::super::dto::authentication_methods::{request, response};
use crate::modules::authentication_methods::models::authentication_method::{
	CreateAuthenticationMethod, UpdateAuthenticationMethod,
};
use crate::{
	errors::AppError,
	modules::authentication_methods::models::authentication_method::AuthenticationMethod,
};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, delete, put};
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
	all: Option<bool>
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
	state: web::Data<AppState>,
	form: web::Json<request::CreateAuthenticationMethodDTO>,
) -> Result<HttpResponse, AppError> {
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
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
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
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateAuthenticationMethodDTO>,
) -> ApiResponse {
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
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	AuthenticationMethod::remove(conn, params.authentication_method_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
