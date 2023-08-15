use super::super::dto::response;
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
}

#[derive(Deserialize, IntoParams)]
#[serde(rename_all = "camelCase")]
pub struct FindOneQueryParams {
	lang: String,
	slug: Option<String>,
	id: Option<Uuid>
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
pub async fn find_one(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	query: web::Query<FindOneQueryParams>
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let content = if query.slug.is_some() {
		Content::find_one_public_by_slug(conn, params.site_id, query.slug.as_ref().unwrap(), &query.lang)
	} else if query.id.is_some() {
		Content::find_one_public_by_uuid(conn, params.site_id, query.id.as_ref().unwrap(), &query.lang)
	} else {
		return Err(AppError::BadRequest(AppErrorValue {
			message: "Please pass a id or slug as a query parameter".to_string(),
			status: StatusCode::BAD_REQUEST.as_u16(),
			code: "INCOMPLETE_REQUEST".to_owned(),
			..Default::default()
		}))
	};

	let res = response::PublicContentDTO::from(content?);
	Ok(HttpResponse::Ok().json(res))
}
