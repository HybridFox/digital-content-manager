use super::super::models::site::{UpdateSite, Site};
use super::super::dto::{request, response};
use crate::errors::AppError;
use crate::modules::auth::helpers::permissions::ensure_permission;
use crate::modules::core::helpers::auth::get_user_id_from_req;
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::modules::iam_policies::models::iam_policy::IAMPolicy;
use crate::modules::iam_policies::models::permission::Permission;
use crate::modules::iam_policies::models::permission_iam_action::PermissionIAMAction;
use crate::modules::roles::models::role::Role;
use crate::modules::sites::models::site_language::SiteLanguage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, put, delete, HttpRequest};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	site_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/sites",
    request_body = CreateSiteDTO,
	responses(
		(status = 200, body = SiteDTO),
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
	form: web::Json<request::CreateSiteDTO>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(&req, None, format!("urn:dcm:sites:*"), "root::sites:create")?;
	let conn = &mut state.get_conn()?;
	let site = Site::create(conn, &form.name)?;
	let policy = IAMPolicy::create(conn, Some(site.id), "Default Admin Policy")?;
	let permission = Permission::create(
		conn,
		policy.id,
		vec!["urn:dcm:*".to_string()],
		"grant".to_owned(),
	)?;
	PermissionIAMAction::create(conn, permission.id, vec!["sites::*".to_string()])?;

	// Asign policy to role
	let _ = Role::create(
		conn,
		Some(site.id),
		"Default Admin Role".to_string(),
		vec![policy.id],
	)?;
	let languages = SiteLanguage::upsert(conn, site.id, form.languages.clone())?;

	let res = response::SiteWithLanguagesDTO::from((site, None, languages));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites",
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
) -> Result<HttpResponse, AppError> {
	ensure_permission(&req, None, format!("urn:dcm:sites:*"), "root::sites:read")?;
	let conn = &mut state.get_conn()?;
	let page = query.page.unwrap_or(1);
	let pagesize = query.pagesize.unwrap_or(20);
	let user_id = get_user_id_from_req(&req)?;

	let (sites, total_elements) = Site::find(conn, page, pagesize, user_id)?;

	let res = response::SitesDTO::from((
		sites,
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
	context_path = "/api/v1/sites",
	responses(
		(status = 200, body = SiteDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{site_id}")]
pub async fn find_one(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	ensure_permission(
		&req,
		None,
		format!("urn:dcm:sites:{}", params.site_id),
		"root::sites:read",
	)?;
	let conn = &mut state.get_conn()?;
	let (site, languages) = Site::find_one(conn, params.site_id)?;

	let res = response::SiteWithLanguagesDTO::from((site, None, languages));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites",
    request_body = UpdateSiteDTO,
	responses(
		(status = 200, body = SiteDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{site_id}")]
pub async fn update(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
	form: web::Json<request::UpdateSiteDTO>,
) -> ApiResponse {
	ensure_permission(
		&req,
		None,
		format!("urn:dcm:sites:{}", params.site_id),
		"root::sites:update",
	)?;
	let conn = &mut state.get_conn()?;
	let site = Site::update(
		conn,
		params.site_id,
		UpdateSite {
			name: form.name.clone(),
		},
	)?;
	let languages = SiteLanguage::upsert(conn, site.id, form.languages.clone())?;
	let res = response::SiteWithLanguagesDTO::from((site, None, languages));
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/sites",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[delete("/{site_id}")]
pub async fn remove(
	req: HttpRequest,
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
) -> ApiResponse {
	ensure_permission(
		&req,
		None,
		format!("urn:dcm:sites:{}", params.site_id),
		"root::sites:remove",
	)?;
	let conn = &mut state.get_conn()?;
	Site::remove(conn, params.site_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
