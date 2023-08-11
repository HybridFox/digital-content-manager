use super::super::models::site::{UpdateSite, Site};
use super::super::dto::{request, response};
use crate::errors::AppError;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, put, delete};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	site_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/sites",
    request_body = CreateSiteDTO,
	responses(
		(status = 200, body = SiteDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[post("")]
pub async fn create(
	state: web::Data<AppState>,
	form: web::Json<request::CreateSiteDTO>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let site = Site::create(conn, &form.name)?;
	let res = response::SiteDTO::from(site);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites",
	responses(
		(status = 200, body = SitesDTO),
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

	let (sites, total_elements) = Site::find(conn, page, pagesize)?;

	let res = response::SitesDTO::from((
		sites,
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
	context_path = "/api/v1/sites",
	responses(
		(status = 200, body = SiteDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{site_id}")]
pub async fn find_one(
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let site = Site::find_one(conn, params.site_id)?;

	let res = response::SiteDTO::from(site);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites",
    request_body = UpdateSiteDTO,
	responses(
		(status = 200, body = SiteDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{site_id}")]
pub async fn update(
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
	form: web::Json<request::UpdateSiteDTO>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	let site = Site::update(
		conn,
		params.site_id,
		UpdateSite {
			name: form.name.clone(),
		},
	)?;
	let res = response::SiteDTO::from(site);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[delete("/{site_id}")]
pub async fn remove(state: web::Data<AppState>, params: web::Path<FindPathParams>) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	Site::remove(conn, params.site_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
