use super::super::models::role::{UpdateRole, Role};
use super::super::dto::{request, response};
use crate::errors::AppError;
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, put, delete, HttpRequest};
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
	role_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/roles",
    request_body = CreateRoleDTO,
	responses(
		(status = 200, body = RoleDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[post("")]
pub async fn create(
	req: HttpRequest,
	state: web::Data<AppState>,
	form: web::Json<request::CreateRoleDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:roles:*"),
		"sites::roles:create",
	)
	.or_else(|_| ensure_permission(&req, None, format!("urn:dcm:roles:*"), "root::roles:create"))?;
	let conn = &mut state.get_conn()?;
	let (role, policies) = Role::create(
		conn,
		Some(params.site_id),
		form.name.clone(),
		form.policies.clone(),
	)?;
	let res = response::RoleWithPoliciesDTO::from((role, policies));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/roles",
	responses(
		(status = 200, body = RolesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams, FindAllQueryParams)
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
		format!("urn:dcm:roles:*"),
		"sites::roles:read",
	)
	.or_else(|_| ensure_permission(&req, None, format!("urn:dcm:roles:*"), "root::roles:read"))?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(10);

	let (roles, total_elements) = Role::find(conn, Some(params.site_id), page, pagesize)?;

	let res = response::SiteRolesWithPoliciesDTO::from((
		roles,
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
	context_path = "/api/v1/sites/{site_id}/roles",
	responses(
		(status = 200, body = RoleWithPoliciesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{role_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:roles:{}", params.role_id),
		"sites::roles:read",
	)
	.or_else(|_| {
		ensure_permission(
			&req,
			None,
			format!("urn:dcm:roles:{}", params.role_id),
			"root::roles:read",
		)
	})?;
	let conn = &mut state.get_conn()?;
	let role = Role::find_one(conn, Some(params.site_id), params.role_id)?;
	let policies = Role::find_policies(conn, &role)?;

	let res = response::RoleWithPoliciesDTO::from((role, policies));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/roles",
    request_body = UpdateRoleDTO,
	responses(
		(status = 200, body = RoleDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{role_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateRoleDTO>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:roles:{}", params.role_id),
		"sites::roles:update",
	)
	.or_else(|_| {
		ensure_permission(
			&req,
			None,
			format!("urn:dcm:roles:{}", params.role_id),
			"root::roles:update",
		)
	})?;
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
	context_path = "/api/v1/sites/{site_id}/roles",
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
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:roles:{}", params.role_id),
		"sites::roles:remove",
	)
	.or_else(|_| {
		ensure_permission(
			&req,
			None,
			format!("urn:dcm:roles:{}", params.role_id),
			"root::roles:remove",
		)
	})?;
	let conn = &mut state.get_conn()?;
	Role::remove(conn, params.role_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
