use super::super::dto::revisions::response;
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::content::models::content_revision::ContentRevision;
use crate::errors::AppError;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use actix_web::{get, web, HttpResponse, HttpRequest};
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
	content_id: Uuid,
	revision_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct ComparePathParams {
	site_id: Uuid,
	content_id: Uuid,
	first_revision_id: Uuid,
	second_revision_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
#[serde(rename_all = "camelCase")]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
	translation_id: Option<Uuid>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content",
	responses(
		(status = 200, body = ContentListDTO),
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
	ensure_permission(&req, Some(params.site_id), format!("urn:ibs:content:*"), "sites::content:read")?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(10);

	let (revisions, total_elements) = ContentRevision::find(
		conn,
		params.site_id,
		page,
		pagesize,
		query.translation_id,
	)?;

	let res = response::ContentRevisionsDTO::from((
		revisions,
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
	context_path = "/api/v1/sites/{site_id}/content",
	responses(
		(status = 200, body = ContentWithFieldsDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{revision_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(&req, Some(params.site_id), format!("urn:ibs:content:{}", params.content_id), "sites::content:read")?;
	let conn = &mut state.get_conn()?;
	let revision = ContentRevision::find_one(conn, params.site_id, params.revision_id)?;

	let res = response::ContentRevisionWithFieldsDTO::from(revision);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content",
	responses(
		(status = 200, body = ContentWithFieldsDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{first_revision_id}/compare/{second_revision_id}")]
pub async fn compare(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<ComparePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(&req, Some(params.site_id), format!("urn:ibs:content:{}", params.content_id), "sites::content:read")?;
	let conn = &mut state.get_conn()?;
	let first_revision = ContentRevision::find_one(conn, params.site_id, params.first_revision_id)?;
	let second_revision = ContentRevision::find_one(conn, params.site_id, params.second_revision_id)?;

	let first_res = response::ContentRevisionWithFieldsDTO::from(first_revision);
	let second_res = response::ContentRevisionWithFieldsDTO::from(second_revision);
	Ok(HttpResponse::Ok().json(vec![first_res, second_res]))
}
