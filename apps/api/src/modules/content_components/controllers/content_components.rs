use super::super::dto::content_components::{request, response};
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::{
	errors::AppError,
	modules::content_components::models::content_component::UpdateContentComponent,
};
use crate::modules::content_components::models::content_component::ContentComponent;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, put, HttpResponse, delete, HttpRequest};
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
	content_component_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
#[serde(rename_all = "camelCase")]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
	include_internal: Option<bool>,
	include_hidden: Option<bool>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-components",
    request_body = CreateContentComponentDTO,
	responses(
		(status = 200, body = ContentComponentWithFieldsDTO),
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
	form: web::Json<request::CreateContentComponentDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(&req, Some(params.site_id), format!("urn:ibs:content-components:*"), "sites::content-components:create")?;
	let conn = &mut state.get_conn()?;
	let content_component = ContentComponent::create(
		conn,
		params.site_id,
		form.name.clone(),
		form.description.clone(),
		form.component_name.clone(),
	)?;
	let res = response::ContentComponentWithFieldsDTO::from(content_component);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-components",
	responses(
		(status = 200, body = ContentComponentsDTO),
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
	ensure_permission(&req, Some(params.site_id), format!("urn:ibs:content-components:*"), "sites::content-components:read")?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(10);
	let include_internal = query.include_internal.unwrap_or(false);
	let include_hidden = query.include_hidden.unwrap_or(false);

	let (content_components, total_elements) = ContentComponent::find(
		conn,
		params.site_id,
		page,
		pagesize,
		include_hidden,
		include_internal,
	)?;

	let res = response::ContentComponentsDTO::from((
		content_components,
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
	context_path = "/api/v1/sites/{site_id}/content-components",
	responses(
		(status = 200, body = ContentComponentDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{content_component_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(&req, Some(params.site_id), format!("urn:ibs:content-components:{}", params.content_component_id), "sites::content-components:read")?;
	let conn = &mut state.get_conn()?;
	let content_component =
		ContentComponent::find_one(conn, Some(params.site_id), params.content_component_id)?;
	let populated_content_components =
		ContentComponent::populate_fields(conn, vec![content_component])?;

	let res = response::ContentComponentWithFieldsDTO::from(
		populated_content_components.first().unwrap().clone(),
	);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-components",
    request_body = UpdateContentComponentDTO,
	responses(
		(status = 200, body = ContentComponentWithFieldsDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{content_component_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateContentComponentDTO>,
) -> ApiResponse {
	ensure_permission(&req, Some(params.site_id), format!("urn:ibs:content-components:{}", params.content_component_id), "sites::content-components:update")?;
	let conn = &mut state.get_conn()?;
	let content_component = ContentComponent::update(
		conn,
		params.site_id,
		params.content_component_id,
		UpdateContentComponent {
			name: form.name.clone(),
			description: form.description.clone(),
		},
	)?;
	let res = response::ContentComponentWithFieldsDTO::from(content_component);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-components",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[delete("/{content_component_id}")]
pub async fn remove(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	ensure_permission(&req, Some(params.site_id), format!("urn:ibs:content-components:{}", params.content_component_id), "sites::content-components:remove")?;
	let conn = &mut state.get_conn()?;
	ContentComponent::remove(conn, params.content_component_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
