use super::super::dto::users::{response, request};

use crate::{errors::AppError, modules::users::models::user_role::UserRole};
use crate::modules::users::models::user::{User, UpdateUser};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use actix_web::{get, web, HttpResponse, put, delete, post};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	user_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/users",
    request_body = CreateUserDTO,
	responses(
		(status = 200, body = UserWithRolesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[post("")]
pub async fn create(
	state: web::Data<AppState>,
	form: web::Json<request::CreateUserDTO>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;

	let (user, _token) = User::signup(
		conn,
		&form.email,
		&form.name,
		&form.password,
		None,
		Some("local"),
	)?;
	UserRole::upsert_many(conn, user.id, form.roles.clone())?;
	Ok(HttpResponse::Ok().json(user))
}

#[utoipa::path(
	context_path = "/api/v1/users",
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
	state: web::Data<AppState>,
	query: web::Query<FindAllQueryParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);

	let (users, total_elements) = User::find(conn, page, pagesize)?;

	let res = response::UsersDTO::from((
		users,
		HALPage {
			number: page,
			size: pagesize,
			total_elements,
			total_pages: (total_elements / pagesize + (total_elements % pagesize).signum()).max(1),
		},
		// TODO: Fix
		Uuid::new_v4(),
	));

	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/users",
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
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let user = User::find_one_with_roles(conn, params.user_id)?;

	let res = response::UserWithRolesDTO::from(user);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/users",
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
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
	form: web::Json<request::UpdateUserDTO>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;

	User::update(
		conn,
		params.user_id,
		UpdateUser {
			email: Some(form.email.clone()),
			name: Some(form.name.clone()),
			avatar: None,
			password: None,
			bio: None,
		},
	)?;
	UserRole::upsert_many(conn, params.user_id, form.roles.clone())?;
	let user = User::find_one_with_roles(conn, params.user_id)?;
	Ok(HttpResponse::Ok().json(user))
}

#[utoipa::path(
	context_path = "/api/v1/users",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[delete("/{user_id}")]
pub async fn remove(
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	User::remove(conn, params.user_id)?;
	Ok(HttpResponse::NoContent().body(()))
}

#[utoipa::path(
	context_path = "/api/v1/users",
	responses(
		(status = 200, body = UserWithRolesDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{user_id}/sites")]
pub async fn find_sites(
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let user = User::find_one(conn, params.user_id)?;
	let sites = user.get_sites(conn)?;
	let total_elements = sites.len().to_owned();

	let res = response::SitesWithRolesDTO::from((
		sites,
		HALPage {
			number: 1,
			size: 1,
			total_elements: total_elements as i64,
			total_pages: 1,
		},
		params.user_id,
	));
	Ok(HttpResponse::Ok().json(res))
}
