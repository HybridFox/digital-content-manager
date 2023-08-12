use super::super::dto::{request, response};
use crate::modules::content::models::content::{CreateContent, UpdateContent};
use crate::modules::content_types::models::content_type::ContentTypeKindEnum;
use crate::modules::workflows::models::workflow_state::{WorkflowState, WorkflowTechnicalStateEnum};
use crate::{errors::AppError, modules::content::models::content::Content};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, delete, put};
use chrono::Utc;
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
	content_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct DefaultValuesPathParams {
	site_id: Uuid,
	translation_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
#[serde(rename_all = "camelCase")]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
	kind: Option<ContentTypeKindEnum>,
	language_id: Option<Uuid>,
	translation_id: Option<Uuid>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content",
    request_body = CreateContentDTO,
	responses(
		(status = 200, body = ContentWithFieldsDTO),
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
	form: web::Json<request::CreateContentDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let translation_id = match form.translation_id {
		Some(id) => id,
		None => Uuid::new_v4(),
	};

	let content = Content::create(
		conn,
		params.site_id,
		CreateContent {
			name: form.name.clone(),
			content_type_id: form.content_type_id.clone(),
			slug: slugify(&form.name),
			workflow_state_id: form.workflow_state_id.clone(),
			language_id: form.language_id.clone(),
			translation_id,
			site_id: params.site_id,
		},
		form.fields.clone(),
	)?;

	let res = response::ContentWithFieldsDTO::from(content);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content",
	responses(
		(status = 200, body = ContentListDTO),
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

	let (content, total_elements) = Content::find(
		conn,
		params.site_id,
		page,
		pagesize,
		query.kind,
		query.language_id,
		query.translation_id,
	)?;

	let res = response::ContentListDTO::from((
		content,
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
	context_path = "/api/v1/sites/{site_id}/content",
	responses(
		(status = 200, body = ContentWithFieldsDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{content_id}")]
pub async fn find_one(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let content = Content::find_one(conn, params.site_id, params.content_id)?;

	let res = response::ContentWithFieldsDTO::from(content);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content",
    request_body = UpdateContentDTO,
	responses(
		(status = 200, body = ContentWithFieldsDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{content_id}")]
pub async fn update(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateContentDTO>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;

	let workflow_state = WorkflowState::find_one(conn, params.site_id, form.workflow_state_id)?;
	let published = if workflow_state.technical_state == WorkflowTechnicalStateEnum::PUBLISHED {
		true
	} else {
		false
	};

	let content = Content::update(
		conn,
		params.site_id,
		form.content_type_id.clone(),
		params.content_id,
		UpdateContent {
			name: form.name.clone(),
			workflow_state_id: form.workflow_state_id.clone(),
			updated_at: Utc::now().naive_utc(),
			published,
		},
		form.fields.clone(),
	)?;
	let res = response::ContentWithFieldsDTO::from(content);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[delete("/{content_id}")]
pub async fn remove(
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	Content::remove(conn, params.content_id)?;
	Ok(HttpResponse::NoContent().body(()))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content/{translation_id}/default-values",
	responses(
		(status = 200, body = ContentWithFieldsDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{translation_id}/default-values")]
pub async fn default_values(
	state: web::Data<AppState>,
	params: web::Path<DefaultValuesPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let content = Content::default_values(conn, params.site_id, params.translation_id)?;

	let res = response::ContentDefaultValuesDTO::from((params.translation_id, content));
	Ok(HttpResponse::Ok().json(res))
}