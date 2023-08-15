use super::super::models::role::{UpdateRole, Role};
use super::super::dto::{request, response};
use crate::errors::AppError;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, put, delete};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindOnePathParams {
	role_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/roles",
    request_body = CreateRoleDTO,
	responses(
		(status = 200, body = RoleDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[post("")]
pub async fn create(
	state: web::Data<AppState>,
	form: web::Json<request::CreateRoleDTO>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let (role, policies) = Role::create(conn, None, form.name.clone(), form.policies.clone())?;
	let res = response::RoleWithPoliciesDTO::from((role, policies));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/roles",
	responses(
		(status = 200, body = RolesDTO),
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

	let (roles, total_elements) = Role::find(conn, None, page, pagesize)?;

	let res = response::RolesWithPoliciesDTO::from((
		roles,
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
	context_path = "/api/v1/roles",
	responses(
		(status = 200, body = RoleWithPoliciesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[get("/{role_id}")]
pub async fn find_one(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let role = Role::find_one(conn, None, params.role_id)?;
	let policies = Role::find_policies(conn, &role)?;

	let res = response::RoleWithPoliciesDTO::from((role, policies));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/roles",
    request_body = UpdateRoleDTO,
	responses(
		(status = 200, body = RoleDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
)]
#[put("/{role_id}")]
pub async fn update(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateRoleDTO>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	let (role, policies) = Role::update(
		conn,
		params.role_id,
		UpdateRole {
			name: form.name.clone(),
		},
		form.policies.clone(),
	)?;
	let res = response::RoleWithPoliciesDTO::from((role, policies));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/roles",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[delete("/{role_id}")]
pub async fn remove(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	Role::remove(conn, params.role_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
