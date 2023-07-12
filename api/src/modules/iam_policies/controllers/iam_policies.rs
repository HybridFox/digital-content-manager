use super::super::models::iam_policy::{UpdateIAMPolicy, IAMPolicy};
use super::super::dto::{request, response};
use crate::errors::{AppError};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, put, delete};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	team_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindOnePathParams {
	team_id: Uuid,
	iam_policy_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/teams/{team_id}/iam-policies",
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
	state: web::Data<AppState>,
	form: web::Json<request::CreateIAMPolicyDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let policy = IAMPolicy::create(conn, params.team_id, &form.name)?;
	let res = response::IAMPolicyDTO::from(policy);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/teams/{team_id}/iam-policies",
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
	state: web::Data<AppState>,
	query: web::Query<FindAllQueryParams>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);

	let (policies, total_elements) = IAMPolicy::find(conn, params.team_id, page, pagesize)?;

	let res = response::IAMPoliciesDTO::from((
		policies,
		HALPage {
			number: page,
			size: pagesize,
			total_elements,
			total_pages: (total_elements / pagesize + (total_elements % pagesize).signum()).max(1),
		},
		params.team_id,
	));

	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/teams/{team_id}/iam-policies",
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
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let (policy, permissions) = IAMPolicy::find_one(conn, params.team_id, params.iam_policy_id)?;

	let res = response::IAMPolicyWithPermissionsDTO::from((policy, permissions));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/teams/{team_id}/iam-policies",
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
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateIAMPolicyDTO>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	let policy = IAMPolicy::update(
		conn,
		params.iam_policy_id,
		UpdateIAMPolicy {
			name: form.name.clone(),
		},
	)?;
	let res = response::IAMPolicyDTO::from(policy);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/teams/{team_id}/iam-policies",
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
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	IAMPolicy::remove(conn, params.iam_policy_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
