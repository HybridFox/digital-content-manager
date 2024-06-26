use super::super::dto::{request, response};
use super::super::models::iam_policy::{IAMPolicy, UpdateIAMPolicy};
use crate::errors::AppError;
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::modules::iam_policies::models::permission::Permission;
use crate::modules::iam_policies::models::permission_iam_action::PermissionIAMAction;
use crate::utils::api::ApiResponse;
use actix_web::{delete, get, post, put, web, HttpRequest, HttpResponse};
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
	iam_policy_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/iam-policies",
    request_body = CreateIAMPolicyDTO,
	responses(
		(status = 200, body = IAMPolicyDTO),
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
	form: web::Json<request::CreateIAMPolicyDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:policies:*"),
		"sites::policies:create",
	)?;
	let conn = &mut state.get_conn()?;
	let policy = IAMPolicy::create(conn, Some(params.site_id), &form.name)?;

	form.permissions.iter().try_for_each(|permission| {
		let created_permission = Permission::create(
			conn,
			policy.id,
			permission.clone().resources,
			permission.clone().effect,
		)?;
		PermissionIAMAction::create(conn, created_permission.id, permission.actions.clone())?;

		Ok::<(), AppError>(())
	})?;

	let res = response::IAMPolicyDTO::from(policy);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/iam-policies",
	responses(
		(status = 200, body = IAMPoliciesDTO),
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
		format!("urn:dcm:policies:*"),
		"sites::policies:read",
	)?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);

	let (policies, total_elements) = IAMPolicy::find(conn, Some(params.site_id), page, pagesize)?;

	let res = response::SiteIAMPoliciesDTO::from((
		policies,
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
	context_path = "/api/v1/sites/{site_id}/iam-policies",
	responses(
		(status = 200, body = IAMPolicyWithPermissionsDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{iam_policy_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:policies:{}", params.iam_policy_id),
		"sites::policies:read",
	)?;
	let conn = &mut state.get_conn()?;
	let (policy, permissions) =
		IAMPolicy::find_one(conn, Some(params.site_id), params.iam_policy_id)?;

	let res = response::IAMPolicyWithPermissionsDTO::from((policy, permissions));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/iam-policies",
    request_body = UpdateIAMPolicyDTO,
	responses(
		(status = 200, body = IAMPolicyDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{iam_policy_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateIAMPolicyDTO>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:policies:{}", params.iam_policy_id),
		"sites::policies:update",
	)?;
	let conn = &mut state.get_conn()?;
	let policy = IAMPolicy::update(
		conn,
		params.iam_policy_id,
		UpdateIAMPolicy {
			name: form.name.clone(),
		},
	)?;

	let removed_permission_ids = Permission::remove_by_policy_id(conn, params.iam_policy_id)?;
	PermissionIAMAction::remove_by_permission_ids(conn, removed_permission_ids)?;
	form.permissions.iter().try_for_each(|permission| {
		let created_permission = Permission::create(
			conn,
			policy.id,
			permission.clone().resources,
			permission.clone().effect,
		)?;
		PermissionIAMAction::create(conn, created_permission.id, permission.actions.clone())?;

		Ok::<(), AppError>(())
	})?;

	let res = response::IAMPolicyDTO::from(policy);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/iam-policies",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[delete("/{iam_policy_id}")]
pub async fn remove(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:policies:{}", params.iam_policy_id),
		"sites::policies:remove",
	)?;
	let conn = &mut state.get_conn()?;
	IAMPolicy::remove(conn, params.iam_policy_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
