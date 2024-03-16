use super::super::dto::workflows::{request, response};
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::workflows::models::workflow::{CreateWorkflow, UpdateWorkflow};
use crate::{errors::AppError, modules::workflows::models::workflow::Workflow};
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
	context_path = "/api/v1/sites/{site_id}/workflows",
    request_body = CreateWorkflowDTO,
	responses(
		(status = 200, body = WorkflowDTO),
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
	form: web::Json<request::CreateWorkflowDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:workflows:*"),
		"sites::workflows:create",
	)?;
	let conn = &mut state.get_conn()?;
	let workflow = Workflow::create(
		conn,
		params.site_id,
		CreateWorkflow {
			name: form.name.clone(),
			slug: slugify(&form.name),
			default_workflow_state_id: form.default_workflow_state_id.clone(),
			description: form.description.clone(),
		},
		form.transitions.clone(),
	)?;
	let res = response::WorkflowDTO::from(workflow);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/workflows",
	responses(
		(status = 200, body = WorkflowsDTO),
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
		format!("urn:dcm:workflows:*"),
		"sites::workflows:read",
	)
	.or_else(|_| {
		ensure_permission(
			&req,
			Some(params.site_id),
			format!("urn:dcm:content:*"),
			"sites::content:read",
		)
	})?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(10);

	let (workflows, total_elements) = Workflow::find(conn, params.site_id, page, pagesize)?;

	let res = response::WorkflowsDTO::from((
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
	context_path = "/api/v1/sites/{site_id}/workflows",
	responses(
		(status = 200, body = WorkflowDTO),
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
		format!("urn:dcm:workflows:{}", params.workflow_id),
		"sites::workflows:read",
	)
	.or_else(|_| {
		ensure_permission(
			&req,
			Some(params.site_id),
			format!("urn:dcm:content:*"),
			"sites::content:read",
		)
	})?;
	let conn = &mut state.get_conn()?;
	let workflow = Workflow::find_one(conn, params.site_id, params.workflow_id)?;

	let res = response::WorkflowDTO::from(workflow);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/workflows",
    request_body = UpdateWorkflowDTO,
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
	form: web::Json<request::UpdateWorkflowDTO>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:workflows:{}", params.workflow_id),
		"sites::workflows:update",
	)?;
	let conn = &mut state.get_conn()?;
	let workflow = Workflow::update(
		conn,
		params.site_id,
		params.workflow_id,
		UpdateWorkflow {
			name: form.name.clone(),
			description: form.description.clone(),
			default_workflow_state_id: form.default_workflow_state_id.clone(),
		},
		form.transitions.clone(),
	)?;
	let res = response::WorkflowDTO::from(workflow);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/workflows",
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
		format!("urn:dcm:workflows:{}", params.workflow_id),
		"sites::workflows:remove",
	)?;
	let conn = &mut state.get_conn()?;
	Workflow::remove(conn, params.workflow_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
