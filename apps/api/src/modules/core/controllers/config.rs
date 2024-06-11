use super::super::dto::config::{request, response};
use crate::errors::AppError;
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::config_item::{ConfigItem, CreateConfigItem};
use actix_web::{get, put, web, HttpRequest, HttpResponse};

#[utoipa::path(
	context_path = "/api/v1/config",
    request_body = CreateWorkflowDTO,
	responses(
		(status = 200, body = WorkflowDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[put("")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	form: web::Json<request::UpdateConfigDTO>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		None,
		format!("urn:dcm:config:*"),
		"root::config:update",
	)?;

	let conn = &mut state.get_conn()?;

	let request::UpdateConfigDTO(hashmap) = form.0;
	let create_orders: Vec<CreateConfigItem> = hashmap
		.into_iter()
		.map(|(key, value)| CreateConfigItem {
			key,
			value,
			site_id: None,
			module_name: None,
		})
		.collect();

	let config_items = ConfigItem::upsert(conn, None, None, create_orders)?;

	let res = response::ConfigDTO::from(config_items);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/config",
	responses(
		(status = 200, body = WorkflowDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[get("")]
pub async fn find_all(
	req: HttpRequest,
	state: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let config_items = ConfigItem::find(conn, None, None)?;

	dbg!(&config_items);

	let res = response::ConfigDTO::from(config_items);
	Ok(HttpResponse::Ok().json(res))
}
