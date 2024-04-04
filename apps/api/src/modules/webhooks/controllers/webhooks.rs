use super::super::dto::webhooks::{request, response};
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::webhooks::models::webhook::{CreateWebhook, UpdateWebhook};
use crate::{errors::AppError, modules::webhooks::models::webhook::Webhook};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, delete, put, HttpRequest};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindOnePathParams {
	site_id: Uuid,
	webhook_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	site_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
	all: Option<bool>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/webhooks",
    request_body = CreateWebhookDTO,
	responses(
		(status = 200, body = WebhookDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[post("")]
pub async fn create(
	req: HttpRequest,
	state: web::Data<AppState>,
	form: web::Json<request::CreateWebhookDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:webhooks:*"),
		"sites::webhooks:create",
	)?;
	let conn = &mut state.get_conn()?;
	let webhook = Webhook::create(
		conn,
		CreateWebhook {
			event: form.event.clone(),
			url: form.url.clone(),
			request_configuration: form.request_configuration.clone(),
			active: form.active.clone(),
			site_id: params.site_id,
		},
	)?;
	let res = response::WebhookDTO::from(webhook);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/webhooks",
	responses(
		(status = 200, body = WebhooksDTO),
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
		format!("urn:dcm:webooks:*"),
		"sites::webooks:read",
	)?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);

	let (webhooks, total_elements) =
		Webhook::find(conn, params.site_id, page, pagesize, query.all)?;

	let res = response::WebhooksDTO::from((
		webhooks,
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
	context_path = "/api/v1/sites/{site_id}/webhooks",
	responses(
		(status = 200, body = WebhookDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[get("/{webhook_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:webooks:*"),
		"sites::webooks:read",
	)?;
	let conn = &mut state.get_conn()?;
	let webhook = Webhook::find_one(conn, params.webhook_id)?;

	let res = response::WebhookDTO::from(webhook);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/webhooks",
    request_body = UpdateWebhookDTO,
	responses(
		(status = 200, body = SiteDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[put("/{webhook_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
	form: web::Json<request::UpdateWebhookDTO>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:webhooks:{}", params.webhook_id),
		"sites::webhooks:update",
	)?;
	let conn = &mut state.get_conn()?;
	let webhook = Webhook::update(
		conn,
		params.webhook_id,
		UpdateWebhook {
			event: form.event.clone(),
			url: form.url.clone(),
			request_configuration: form.request_configuration.clone(),
			active: form.active.clone(),
		},
	)?;
	let res = response::WebhookDTO::from(webhook);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/webhooks",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindOnePathParams)
)]
#[delete("/{webhook_id}")]
pub async fn remove(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindOnePathParams>,
) -> ApiResponse {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:dcm:webhooks:{}", params.webhook_id),
		"sites::workflows:remove",
	)?;
	let conn = &mut state.get_conn()?;
	Webhook::remove(conn, params.webhook_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
