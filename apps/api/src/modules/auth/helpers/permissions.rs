use actix_web::{HttpRequest, web::Data};
use diesel::{PgConnection, prelude::*, QueryDsl, SelectableHelper, sql_types::Array};
use regex::Regex;
use reqwest::StatusCode;
use uuid::Uuid;
use actix_web::HttpMessage;
use itertools::Itertools;

use crate::{
	modules::{iam_policies::models::permission::Permission, core::middleware::state::AppState, users::models::user::User},
	errors::{AppError, AppErrorValue},
	schema::{users_roles, roles_iam_policies, permissions, permissions_iam_actions, sites_users_roles},
};

pub fn ensure_permission<'a>(
	req: &HttpRequest,
	site_id: Option<Uuid>,
	resource: String,
	action: &'a str,
) -> Result<Uuid, AppError> {
	let app_state = req.app_data::<Data<AppState>>().ok_or(AppError::InternalServerError(AppErrorValue {
		message: "Could not fetch app state from request".to_owned(),
		status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
		code: "APP_STATE_MISSING".to_owned(),
		..Default::default()
	}))?;
	let binding = req.extensions();
	let user = binding.get::<User>()
		.ok_or(AppError::InternalServerError(AppErrorValue {
			message: "Could not fetch user from request".to_owned(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "USER_MISSING".to_owned(),
			..Default::default()
		}))?;
	let conn = &mut app_state.get_conn()?;
	let permissions = get_user_permissions(conn, user.id, site_id)?;

	let result = permissions
		.into_iter()
		.map(|(permission, permission_actions)| {
			let compare_l_action = Regex::new(&permission_actions.first().unwrap().replace("*", "(\\w*)"))?.is_match(action);
			let compare_r_action = Regex::new(&action.replace("*", "(\\w*)"))?.is_match(permission_actions.first().unwrap());

			let compare_l_resource = Regex::new(&permission.resources.0.first().unwrap().replace("*", "(\\w*)"))?.is_match(&resource);
			let compare_r_resource = Regex::new(&resource.replace("*", "(\\w*)"))?.is_match(permission.resources.0.first().unwrap());

			Ok((compare_l_action || compare_r_action) && (compare_l_resource || compare_r_resource))
		})
		.collect::<Result<Vec<bool>, AppError>>()?
		.into_iter()
		.filter(|result| result.to_owned() == true)
		.at_most_one()
		.map_err(|_| AppError::Forbidden(AppErrorValue {
			message: format!("Missing permission: {resource}/{action}"),
			status: StatusCode::FORBIDDEN.as_u16(),
			code: "MISSING_PERMISSION".to_owned(),
			..Default::default()
		}))?;
	
	if result.is_none() {
		return Err(AppError::Forbidden(AppErrorValue {
			message: format!("Missing permission: {resource}/{action}"),
			status: StatusCode::FORBIDDEN.as_u16(),
			code: "MISSING_PERMISSION".to_owned(),
			..Default::default()
		}));
	}

	Ok(user.id)
}

// TODO: Dedupe
pub fn get_user_permissions(
	conn: &mut PgConnection,
	user_id: Uuid,
	site_id: Option<Uuid>,
) -> Result<Vec<(Permission, Vec<String>)>, AppError> {
	if site_id.is_some() {
		let permissions = sites_users_roles::table
			.filter(sites_users_roles::user_id.eq(user_id))
			.filter(sites_users_roles::site_id.eq(site_id.unwrap()))
			.inner_join(
				roles_iam_policies::table.on(roles_iam_policies::role_id.eq(sites_users_roles::role_id)),
			)
			.inner_join(
				permissions::table.on(permissions::iam_policy_id.eq(roles_iam_policies::iam_policy_id)),
			)
			.inner_join(
				permissions_iam_actions::table
					.on(permissions_iam_actions::permission_id.eq(permissions::id)),
			)
			.group_by(permissions::id)
			.select((
				Permission::as_select(),
				diesel::dsl::sql::<Array<diesel::sql_types::Text>>("array_agg(permissions_iam_actions.iam_action_key) actions"),
			))
			.load::<(Permission, Vec<String>)>(conn)?;

		return Ok(permissions)
	}

	let permissions = users_roles::table
		.filter(users_roles::user_id.eq(user_id))
		.inner_join(
			roles_iam_policies::table.on(roles_iam_policies::role_id.eq(users_roles::role_id)),
		)
		.inner_join(
			permissions::table.on(permissions::iam_policy_id.eq(roles_iam_policies::iam_policy_id)),
		)
		.inner_join(
			permissions_iam_actions::table
				.on(permissions_iam_actions::permission_id.eq(permissions::id)),
		)
		.group_by(permissions::id)
		.select((
			Permission::as_select(),
			diesel::dsl::sql::<Array<diesel::sql_types::Text>>("array_agg(permissions_iam_actions.iam_action_key) actions"),
		))
		.load::<(Permission, Vec<String>)>(conn)?;

	Ok(permissions)
}
