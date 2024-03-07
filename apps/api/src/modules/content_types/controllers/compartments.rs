use super::super::dto::compartments::{request, response};
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::content_types::dto::compartments::response::CompartmentDTO;
use crate::modules::content_types::models::compartment::UpdateCompartment;
use crate::{errors::AppError, modules::content_types::models::compartment::CompartmentModel};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, delete, put, HttpRequest};
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
	compartment_id: Uuid,
	content_type_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types/{content_type_id}/compartments",
    request_body = CreateCompartmentDTO,
	responses(
		(status = 200, body = CompartmentDTO),
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
	form: web::Json<request::CreateCompartmentDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:content-types:{}", params.content_type_id),
		"sites::content-types:update",
	)?;
	let conn = &mut state.get_conn()?;
	let compartment =
		CompartmentModel::create(conn, params.site_id, params.content_type_id, &form.name)?;

	let res = CompartmentDTO::from(compartment);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types/{content_type_id}/compartments",
	responses(
		(status = 200, body = CompartmentsDTO),
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
		format!("urn:dcm:content-types:{}", params.content_type_id),
		"sites::content-types:update",
	)?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(10);

	let (compartments, total_elements) =
		CompartmentModel::find(conn, params.site_id, params.content_type_id, page, pagesize)?;

	let res = response::CompartmentsDTO::from((
		compartments,
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
	context_path = "/api/v1/sites/{site_id}/content-types/{content_type_id}/compartments",
	responses(
		(status = 200, body = CompartmentModelDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{compartment_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:content-types:{}", params.content_type_id),
		"sites::content-types:update",
	)?;
	let conn = &mut state.get_conn()?;
	let compartment = CompartmentModel::find_one(conn, params.site_id, params.compartment_id)?;

	let res = CompartmentDTO::from(compartment);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types/{content_type_id}/compartments",
    request_body = UpdateCompartmentDTO,
	responses(
		(status = 200, body = CompartmentDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{compartment_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateCompartmentDTO>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:content-types:{}", params.content_type_id),
		"sites::content-types:update",
	)?;
	let conn = &mut state.get_conn()?;

	let compartment = CompartmentModel::update(
		conn,
		params.site_id,
		params.compartment_id,
		UpdateCompartment {
			name: form.name.clone(),
			description: form.description.clone(),
		},
	)?;

	let res = CompartmentDTO::from(compartment);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types/{content_type_id}/compartments",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[delete("/{compartment_id}")]
pub async fn remove(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:content-types:{}", params.content_type_id),
		"sites::content-types:update",
	)?;
	let conn = &mut state.get_conn()?;
	CompartmentModel::remove(conn, params.compartment_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
