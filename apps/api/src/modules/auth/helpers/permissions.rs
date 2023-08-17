use diesel::{PgConnection, prelude::*, QueryDsl, SelectableHelper, sql_types::{Array, Json, Jsonb}};
use uuid::Uuid;

use crate::{
	modules::iam_policies::models::permission::Permission,
	errors::AppError,
	schema::{users_roles, roles_iam_policies, permissions, permissions_iam_actions, sites_users_roles},
};

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
