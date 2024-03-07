use super::super::models::language::Language;
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::sites::dto::languages::response::LanguagesDTO;
use crate::{errors::AppError, modules::sites::dto::languages::response::LanguageDTO};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use actix_web::{get, web, HttpResponse, HttpRequest};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	language_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/iam-actions",
	responses(
		(status = 200, body = LanguagesDTO),
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
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		None,
		format!("urn:dcm:languages:*"),
		"root::languages::read",
	)?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(10);

	let (languages, total_elements) = Language::find(conn, page, pagesize)?;

	let res = LanguagesDTO::from((
		languages,
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
	context_path = "/api/v1/languages",
	responses(
		(status = 200, body = LanguageDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{language_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		None,
		format!("urn:dcm:languages:{}", params.language_id),
		"root::languages::read",
	)?;
	let conn = &mut state.get_conn()?;
	let language = Language::find_one(conn, params.language_id)?;

	let res = LanguageDTO::from(language);
	Ok(HttpResponse::Ok().json(res))
}
