use super::super::dto::content::response;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::{errors::AppError, modules::content::models::content::Content};
use actix_web::{get, web, HttpResponse};
use serde::Deserialize;
use serde_with::{formats::CommaSeparator, serde_as, StringWithSeparator};
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindOnePathParams {
	site_id: Uuid,
	content_id: String,
}

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	site_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
#[serde(rename_all = "camelCase")]
pub struct FindOneQueryParams {
	lang: String,
	populate: Option<bool>,
}

#[serde_as]
#[derive(Deserialize, IntoParams)]
#[serde(rename_all = "camelCase")]
pub struct FindQueryParams {
	lang: String,
	populate: Option<bool>,
	page: Option<i64>,
	pagesize: Option<i64>,
	#[serde_as(as = "Option<StringWithSeparator::<CommaSeparator, Uuid>>")]
	content_types: Option<Vec<Uuid>>,
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
	// params(FindPathParams)
)]
#[get("/{content_id}")]
pub async fn find_one(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	query: web::Query<FindOneQueryParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let (content, revision, fields, languages, translations) = Content::find_one_public(
		conn,
		params.site_id,
		params.content_id.clone(),
		query.populate,
		&query.lang,
	)?;

	let res = response::PublicContentDTO::from((
		content,
		revision,
		fields,
		languages,
		translations,
		query.populate.unwrap_or(false),
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
	// params(FindPathParams)
)]
#[get("")]
pub async fn find(
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
	query: web::Query<FindQueryParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);

	let (content, total_elements) = Content::find_public(
		conn,
		params.site_id,
		page,
		pagesize,
		&query.lang,
		&query.content_types,
		&query.populate,
	)?;

	let res = response::PublicContentListDTO::from((
		content,
		HALPage {
			number: page,
			size: pagesize,
			total_elements,
			total_pages: (total_elements / pagesize + (total_elements % pagesize).signum()).max(1),
		},
		query.populate.unwrap_or(false),
		params.site_id,
	));
	Ok(HttpResponse::Ok().json(res))
}
