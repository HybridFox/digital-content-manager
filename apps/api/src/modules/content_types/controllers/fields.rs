use super::super::dto::fields::{request, response};
use crate::modules::content_components::dto::content_components::response::FieldWithContentComponentDTO;
use crate::modules::content_types::models::field::{UpdateField, FieldTypeEnum};
use crate::modules::content_types::models::field_config::FieldConfig;
use crate::{errors::AppError, modules::content_types::models::field::FieldModel};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, delete, put};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	site_id: Uuid,
	content_type_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindOnePathParams {
	site_id: Uuid,
	field_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types/{content_type_id}/fields",
    request_body = CreateFieldDTO,
	responses(
		(status = 200, body = FieldDTO),
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
	form: web::Json<request::CreateFieldDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let field = FieldModel::create(
		conn,
		params.site_id,
		params.content_type_id,
		form.content_component_id,
		FieldTypeEnum::ContentTypeField,
		&form.name,
	)?;

	let res = FieldWithContentComponentDTO::from(field);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types/{content_type_id}/fields",
	responses(
		(status = 200, body = FieldsDTO),
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
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);

	let (fields, total_elements) =
		FieldModel::find(conn, params.site_id, params.content_type_id, page, pagesize)?;

	let res = response::FieldsDTO::from((
		fields,
		HALPage {
			number: page,
			size: pagesize,
			total_elements,
			total_pages: (total_elements / pagesize + (total_elements % pagesize).signum()).max(1),
		},
		params.site_id,
		params.content_type_id,
	));

	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types/{content_type_id}/fields",
	responses(
		(status = 200, body = FieldModelDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{field_id}")]
pub async fn find_one(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let field = FieldModel::find_one(conn, params.site_id, params.field_id)?;

	let res = FieldWithContentComponentDTO::from(field);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types/{content_type_id}/fields",
    request_body = UpdateFieldDTO,
	responses(
		(status = 200, body = FieldWithContentComponentDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{field_id}")]
pub async fn update(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateFieldDTO>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;

	FieldConfig::upsert(conn, params.field_id, form.config.clone())?;
	let field = FieldModel::update(
		conn,
		params.site_id,
		params.field_id,
		UpdateField {
			name: form.name.clone(),
			description: form.description.clone(),
			min: form.min.clone(),
			max: form.max.clone(),
			hidden: form.hidden.clone(),
			multi_language: form.multi_language.clone(),
		},
	)?;

	let res = FieldWithContentComponentDTO::from(field);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types/{content_type_id}/fields",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[delete("/{field_id}")]
pub async fn remove(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	FieldModel::remove(conn, params.field_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
