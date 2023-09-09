use super::super::dto::content::response;
use crate::errors::AppErrorValue;
use crate::{errors::AppError, modules::content::models::content::Content};
use crate::modules::core::middleware::state::AppState;
use actix_web::{get, web, HttpResponse};
use reqwest::StatusCode;
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindOnePathParams {
	site_id: Uuid,
	content_id: String,
}

#[derive(Deserialize, IntoParams)]
#[serde(rename_all = "camelCase")]
pub struct FindOneQueryParams {
	lang: String,
	slug: Option<String>,
	id: Option<Uuid>,
	populate: Option<bool>,
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
