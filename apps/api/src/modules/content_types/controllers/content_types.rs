use super::super::dto::{request, response};
use crate::errors::AppError;
use crate::modules::content_types::models::content_type::ContentType;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, delete};
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
	content_type_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
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
	state: web::Data<AppState>,
	form: web::Json<request::CreateContentTypeDTO>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let content_type = ContentType::create(conn, params.site_id, &form.name)?;
	let res = response::ContentTypeDTO::from(content_type);
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
	state: web::Data<AppState>,
	query: web::Query<FindAllQueryParams>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);

	let (content_types, total_elements) = ContentType::find(conn, params.site_id, page, pagesize)?;

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
		(status = 200, body = ContentTypeDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{content_type_id}")]
pub async fn find_one(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let content_type = ContentType::find_one(conn, params.site_id, params.content_type_id)?;

	let res = response::ContentTypeDTO::from(content_type);
	Ok(HttpResponse::Ok().json(res))
}

// #[utoipa::path(
// 	context_path = "/api/v1/sites",
//     request_body = UpdateSiteDTO,
// 	responses(
// 		(status = 200, body = SiteDTO),
// 		(status = 401, body = AppErrorValue, description = "Unauthorized")
// 	),
//     security(
//         ("jwt_token" = [])
//     ),
// 	params(FindPathParams)
// )]
// #[put("/{site_id}")]
// pub async fn update(
// 	state: web::Data<AppState>,
// 	params: web::Path<FindPathParams>,
// 	form: web::Json<request::UpdateSiteDTO>,
// ) -> ApiResponse {
// 	let conn = &mut state.get_conn()?;
// 	let site = Site::update(
// 		conn,
// 		params.site_id,
// 		UpdateSite {
// 			name: form.name.clone(),
// 		},
// 	)?;
// 	let res = response::SiteDTO::from(site);
// 	Ok(HttpResponse::Ok().json(res))
// }

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
pub async fn remove(state: web::Data<AppState>, params: web::Path<FindOnePathParams>) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	ContentType::remove(conn, params.content_type_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
