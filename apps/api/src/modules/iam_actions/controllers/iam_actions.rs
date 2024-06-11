use super::super::dto::response;
use super::super::models::iam_action::IAMAction;
use crate::errors::AppError;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use actix_web::{get, web, HttpResponse};
use serde::Deserialize;
use utoipa::IntoParams;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	iam_action_key: String,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
	kind: Option<String>,
}

#[utoipa::path(
	context_path = "/api/v1/iam-actions",
	responses(
		(status = 200, body = IAMActionsDTO),
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

	let (iam_actions, total_elements) = IAMAction::find(conn, page, pagesize, &query.kind)?;

	let res = response::IAMActionsDTO::from((
		iam_actions,
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
	context_path = "/api/v1/iam-actions",
	responses(
		(status = 200, body = IAMActionDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{iam_action_key}")]
pub async fn find_one(
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let iam_action = IAMAction::find_one(conn, params.iam_action_key.clone())?;

	let res = response::IAMActionDTO::from(iam_action);
	Ok(HttpResponse::Ok().json(res))
}
