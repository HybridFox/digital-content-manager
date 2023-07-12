use super::super::models::team::{UpdateTeam, Team};
use super::super::dto::{request, response};
use crate::errors::{AppError};
use crate::modules::core::middleware::state::AppState;
use crate::modules::core::models::hal::HALPage;
use crate::utils::api::ApiResponse;
use actix_web::{get, post, web, HttpResponse, put, delete};
use serde::Deserialize;
use utoipa::IntoParams;
use uuid::Uuid;

#[derive(Deserialize, IntoParams)]
pub struct FindPathParams {
	team_id: Uuid,
}

#[derive(Deserialize, IntoParams)]
pub struct FindAllQueryParams {
	page: Option<i64>,
	pagesize: Option<i64>,
}

#[utoipa::path(
	context_path = "/api/v1/teams",
    request_body = CreateTeamDTO,
	responses(
		(status = 200, body = TeamDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    )
)]
#[post("")]
pub async fn create(
	state: web::Data<AppState>,
	form: web::Json<request::CreateTeamDTO>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let team = Team::create(conn, &form.name)?;
	let res = response::TeamDTO::from(team);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/teams",
	responses(
		(status = 200, body = TeamsDTO),
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

	let (teams, total_elements) = Team::find(conn, page, pagesize)?;

	let res = response::TeamsDTO::from((
		teams,
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
	context_path = "/api/v1/teams",
	responses(
		(status = 200, body = TeamDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[get("/{team_id}")]
pub async fn find_one(
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;
	let team = Team::find_one(conn, params.team_id)?;

	let res = response::TeamDTO::from(team);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/teams",
    request_body = UpdateTeamDTO,
	responses(
		(status = 200, body = TeamDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[put("/{team_id}")]
pub async fn update(
	state: web::Data<AppState>,
	params: web::Path<FindPathParams>,
	form: web::Json<request::UpdateTeamDTO>,
) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	let team = Team::update(
		conn,
		params.team_id,
		UpdateTeam {
			name: form.name.clone(),
		},
	)?;
	let res = response::TeamDTO::from(team);
	Ok(HttpResponse::Ok().json(res))
}

#[utoipa::path(
	context_path = "/api/v1/teams",
	responses(
		(status = 204),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	),
    security(
        ("jwt_token" = [])
    ),
	params(FindPathParams)
)]
#[delete("/{team_id}")]
pub async fn remove(state: web::Data<AppState>, params: web::Path<FindPathParams>) -> ApiResponse {
	let conn = &mut state.get_conn()?;
	Team::remove(conn, params.team_id)?;
	Ok(HttpResponse::NoContent().body(()))
}
