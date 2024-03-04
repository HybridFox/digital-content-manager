use super::super::dto::field_order::request;
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::content_types::models::field::UpdateFieldOrder;
use crate::{errors::AppError, modules::content_types::models::field::FieldModel};
use crate::modules::core::middleware::state::AppState;
use actix_web::{patch, web, HttpResponse, HttpRequest};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	site_id: Uuid,
	content_type_id: Uuid,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/content-types/{content_type_id}/field-order",
    request_body = UpdateFieldOrderDTO,
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
)]
#[patch("")]
pub async fn update_order(
	req: HttpRequest,
	state: web::Data<AppState>,
	form: web::Json<request::UpdateFieldOrderDTO>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:ibs:content-types:{}", params.content_type_id),
		"sites::content-types:update",
	)?;

	let conn = &mut state.get_conn()?;

	let changes: Vec<UpdateFieldOrder> = form
		.fields
		.clone()
		.into_iter()
		.map(|change| UpdateFieldOrder {
			id: change.id.clone(),
			sequence_number: Some(change.sequence_number),
			compartment_id: change.compartment_id,
		})
		.collect();

	FieldModel::update_order(conn, params.site_id, changes)?;

	Ok(HttpResponse::NoContent().body(()))
}
