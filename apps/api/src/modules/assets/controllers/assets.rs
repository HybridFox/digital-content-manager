// use super::super::models::site::{UpdateSite, Site};
use super::super::dto::{request, response};
use crate::modules::assets::models::asset::CreateAsset;
use crate::{errors::AppError, modules::assets::models::asset::Asset};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use actix_multipart::form::MultipartForm;
use actix_web::{get, post, web, HttpResponse};
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
	asset_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/assets",
    request_body = CreateAssetDTO,
	responses(
		(status = 200, body = AssetDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[post("")]
pub async fn upload(
	state: web::Data<AppState>,
	MultipartForm(form): MultipartForm<request::CreateAssetDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let s3_key_prefix = format!("/sites/{}", params.site_id);
	let uploaded_file = state.s3.upload(&form.file, &s3_key_prefix).await?;

	let asset = Asset::create(
		conn,
		CreateAsset {
			name: &form.name,
			description: &form.description,
			file_extension: &uploaded_file.extension,
			file_reference: &uploaded_file.filename,
			file_size: uploaded_file.size as i64,
			file_mime: &uploaded_file.mime,
			site_id: params.site_id,
		},
	)?;

	let res = response::AssetDTO::from(asset);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/assets",
	responses(
		(status = 200, body = AssetsDTO),
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

	let (assets, total_elements) = Asset::find(conn, params.site_id, page, pagesize)?;

	let res = response::AssetsDTO::from((
		assets,
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
	context_path = "/api/v1/sites/{site_id}/assets",
	responses(
		(status = 200, body = AssetDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{asset_id}")]
pub async fn find_one(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let asset = Asset::find_one(conn, params.site_id, params.asset_id)?;

	let res = response::AssetDTO::from(asset);
	Ok(HttpResponse::Ok().json(res))
}
