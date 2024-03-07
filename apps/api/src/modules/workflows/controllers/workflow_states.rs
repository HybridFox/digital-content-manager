use super::super::dto::workflow_states::{request, response};
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::workflows::models::workflow_state::{CreateWorkflowState, UpdateWorkflowState};
use crate::{errors::AppError, modules::workflows::models::workflow_state::WorkflowState};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, delete, put, HttpRequest};
use serde::Deserialize;
use slug::slugify;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	site_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindOnePathParams {
	site_id: Uuid,
	workflow_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/workflows-states",
    request_body = CreateWorkflowStateDTO,
	responses(
		(status = 200, body = WorkflowStateDTO),
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
	form: web::Json<request::CreateWorkflowStateDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:workflow-states:*"),
		"sites::workflow-states:create",
	)?;
	let conn = &mut state.get_conn()?;
	let workflow = WorkflowState::create(
		conn,
		params.site_id,
		CreateWorkflowState {
			name: form.name.clone(),
			slug: slugify(&form.name),
			description: form.description.clone(),
			technical_state: form.technical_state.clone(),
		},
	)?;
	let res = response::WorkflowStateDTO::from(workflow);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/workflows-states",
	responses(
		(status = 200, body = WorkflowStatesDTO),
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
		format!("urn:dcm:workflow-states:*"),
		"sites::workflow-states:read",
	)?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(10);

	let (workflows, total_elements) = WorkflowState::find(conn, params.site_id, page, pagesize)?;

	let res = response::WorkflowStatesDTO::from((
		workflows,
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
	context_path = "/api/v1/sites/{site_id}/workflows-states",
	responses(
		(status = 200, body = WorkflowStateDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{workflow_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:workflow-states:{}", params.workflow_id),
		"sites::workflow-states:read",
	)?;
	let conn = &mut state.get_conn()?;
	let workflow = WorkflowState::find_one(conn, params.site_id, params.workflow_id)?;

	let res = response::WorkflowStateDTO::from(workflow);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/workflows-states",
    request_body = UpdateWorkflowStateDTO,
	responses(
		(status = 200, body = SiteDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{workflow_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateWorkflowStateDTO>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:workflow-states:{}", params.workflow_id),
		"sites::workflow-states:update",
	)?;
	let conn = &mut state.get_conn()?;
	let workflow = WorkflowState::update(
		conn,
		params.site_id,
		params.workflow_id,
		UpdateWorkflowState {
			name: form.name.clone(),
			description: form.description.clone(),
			technical_state: form.technical_state.clone(),
		},
	)?;
	let res = response::WorkflowStateDTO::from(workflow);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/workflows-states",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[delete("/{workflow_id}")]
pub async fn remove(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:workflow-states:{}", params.workflow_id),
		"sites::workflow-states:remove",
	)?;
	let conn = &mut state.get_conn()?;
	WorkflowState::remove(conn, params.workflow_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
