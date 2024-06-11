use super::super::dto::content_types::response;
use crate::errors::AppError;
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::content_types::models::content_type::{ContentType, ContentTypeKindEnum};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use actix_web::{delete, get, post, web, HttpRequest, HttpResponse};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
#[serde(rename_all = "camelCase")]
pub struct RootFindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
	site_id: Option<Uuid>,
	kind: Option<ContentTypeKindEnum>,
	include_occurrences: Option<bool>,
}

#[derive(Deserialize, IntoParams)]
pub struct UpdatePathParams {
	site_id: Uuid,
	content_type_id: Uuid,
}

#[utoipa::path(
	context_path = "/api/v1/content-types",
	responses(
		(status = 200, body = ContentTypesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(RootFindAllQueryParams)
)]
#[get("")]
pub async fn find_all(
	req: HttpRequest,
	state: web::Data<AppState>,
	query: web::Query<RootFindAllQueryParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		None,
		format!("urn:dcm:content-types:*"),
		"root::content-types:read",
	)?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);

	let (content_types, total_elements) = ContentType::find_root(
		conn,
		page,
		pagesize,
		query.kind,
		query.include_occurrences,
		query.site_id,
	)?;

	let res = response::ContentTypesDTO::from((
		content_types,
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
	context_path = "/api/v1/content-types",
    request_body = None,
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[post("{content_type_id}/sites/{site_id}")]
pub async fn enable(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<UpdatePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		None,
		format!("urn:dcm:content-types:*"),
		"root::content-types:read",
	)?;
	let conn = &mut state.get_conn()?;

	ContentType::enable_site(conn, params.content_type_id, params.site_id)?;

	Ok(HttpResponse::NoContent().body(()))
}

#[utoipa::path(
	context_path = "/api/v1/content-types",
    request_body = None,
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[delete("{content_type_id}/sites/{site_id}")]
pub async fn disable(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<UpdatePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		None,
		format!("urn:dcm:content-types:*"),
		"root::content-types:read",
	)?;
	let conn = &mut state.get_conn()?;

	ContentType::disable_site(conn, params.content_type_id, params.site_id)?;

	Ok(HttpResponse::NoContent().body(()))
}
