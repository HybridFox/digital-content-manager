use super::super::dto::users::{response, request};
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::sites::models::{site_user_role::SiteUserRole, site_user::SiteUser};
use crate::errors::AppError;
use crate::modules::users::models::user::User;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use actix_web::{get, web, HttpResponse, put, HttpRequest};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	site_id: Uuid,
	user_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllPathParams {
	site_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/users",
	responses(
		(status = 200, body = SitesDTO),
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
	params: web::Path<FindAllPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:ibs:users:*"),
		"sites::users:read",
	)
	.or_else(|_| ensure_permission(&req, None, format!("urn:ibs:users:*"), "root::users:read"))?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(10);

	let (users, total_elements) = User::find_in_site(conn, params.site_id, page, pagesize)?;

	let res = response::UsersDTO::from((
		users,
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
	context_path = "/api/v1/sites/{site_id}/users",
	responses(
		(status = 200, body = UserWithRolesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{user_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:ibs:users:{}", params.user_id),
		"sites::users:read",
	)
	.or_else(|_| {
		ensure_permission(
			&req,
			None,
			format!("urn:ibs:users:{}", params.user_id),
			"root::users:read",
		)
	})?;
	let conn = &mut state.get_conn()?;
	let user = User::find_one_with_roles_in_site(conn, params.site_id, params.user_id)?;

	let res = response::UserWithRolesDTO::from(user);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites/{site_id}/users",
    request_body = UpdateSiteDTO,
	responses(
		(status = 200, body = UserWithRolesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{user_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
	form: web::Json<request::UpdateSiteUserDTO>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		Some(params.site_id),
		format!("urn:ibs:users:{}", params.user_id),
		"sites::users:update",
	)
	.or_else(|_| {
		ensure_permission(
			&req,
			None,
			format!("urn:ibs:users:{}", params.user_id),
			"root::users:update",
		)
	})?;
	let conn = &mut state.get_conn()?;

	if form.roles.len() > 0 {
		SiteUser::upsert(conn, params.site_id, params.user_id)?;
	} else {
		SiteUser::remove(conn, params.site_id, params.user_id)?;
	}

	SiteUserRole::upsert_many(conn, params.site_id, params.user_id, form.roles.clone())?;
	let user = User::find_one_with_roles_in_site(conn, params.site_id, params.user_id)?;
	Ok(HttpResponse::Ok().json(user))
}
