use super::super::dto::content_types::{request, response};
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::content_types::models::content_type::{
	ContentType, ContentTypeKindEnum, CreateContentType,
};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use crate::{errors::AppError, modules::content_types::models::content_type::UpdateContentType};
use actix_web::{delete, get, post, put, web, HttpRequest, HttpResponse};
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
	content_type_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
#[serde(rename_all = "camelCase")]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
	kind: Option<ContentTypeKindEnum>,
	include_occurrences: Option<bool>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types",
    request_body = CreateContentTypeDTO,
	responses(
		(status = 200, body = ContentTypeDTO),
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
	form: web::Json<request::CreateContentTypeDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	// TODO: fix this so it keeps the "kind" in mind.
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:content-types:*"),
		"sites::content-types:create",
	)?;
	let conn = &mut state.get_conn()?;
	let content_type = ContentType::create(
		conn,
		params.site_id,
		CreateContentType {
			name: form.name.clone(),
			slug: slugify(&form.name),
			description: form.description.clone(),
			workflow_id: form.workflow_id.clone(),
			kind: form.kind.clone(),
		},
	)?;
	let res = response::ContentTypeWithFieldsDTO::from((content_type, Vec::new(), Vec::new()));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types",
	responses(
		(status = 200, body = ContentTypesDTO),
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
		format!("urn:dcm:content-types:*"),
		"sites::content-types:read",
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
	let pagesize = query.pagesize.unwrap_or(20);

	let (content_types, total_elements) = ContentType::find(
		conn,
		params.site_id,
		page,
		pagesize,
		query.kind,
		query.include_occurrences,
	)?;

	let res = response::ContentTypesDTO::from((
		content_types,
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
	context_path = "/api/v1/sites/{site_id}/content-types",
	responses(
		(status = 200, body = ContentTypeWithFieldsDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{content_type_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:content-types:{}", params.content_type_id),
		"sites::content-types:read",
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
	let content_type = ContentType::find_one(conn, params.site_id, params.content_type_id)?;
	let res = response::ContentTypeWithFieldsDTO::from(content_type);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types",
    request_body = UpdateContentTypeDTO,
	responses(
		(status = 200, body = SiteDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{content_type_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateContentTypeDTO>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:content-types:{}", params.content_type_id),
		"sites::content-types:update",
	)?;
	let conn = &mut state.get_conn()?;
	let content_type = ContentType::update(
		conn,
		params.site_id,
		params.content_type_id,
		UpdateContentType {
			name: form.name.clone(),
			description: form.description.clone(),
		},
	)?;
	let res = response::ContentTypeWithFieldsDTO::from(content_type);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[delete("/{content_type_id}")]
pub async fn remove(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:content-types:{}", params.content_type_id),
		"sites::content-types:remove",
	)?;
	let conn = &mut state.get_conn()?;
	ContentType::remove(conn, params.content_type_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
