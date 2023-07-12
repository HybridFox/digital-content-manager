use crate::errors::{AppError};
use crate::modules::iam_policies::models::permission_iam_action::PermissionIAMAction;
use crate::schema::{iam_policies, permissions_iam_actions, iam_actions};
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use tracing::instrument;
use uuid::Uuid;

use super::permission::Permission;

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = iam_policies)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct IAMPolicy {
	pub id: Uuid,
	pub name: String,
	pub team_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl IAMPolicy {
	#[instrument(skip(conn))]
	pub fn create(conn: &mut PgConnection, team_id: Uuid, name: &str) -> Result<Self, AppError> {
		use diesel::prelude::*;

		let record = CreateIAMPolicy { name, team_id };

		let role = diesel::insert_into(iam_policies::table)
			.values(&record)
			.returning(IAMPolicy::as_returning())
			.get_result::<IAMPolicy>(conn)?;

		Ok(role)
	}

	pub fn find_one(
		conn: &mut PgConnection,
		team_id: Uuid,
		id: Uuid,
	) -> Result<(Self, Vec<(Permission, Vec<String>)>), AppError> {
		let iam_policy = iam_policies::table
			.filter(iam_policies::team_id.eq(team_id))
			.find(id)
			.select(IAMPolicy::as_select())
			.get_result(conn)?;

		let permissions = Permission::belonging_to(&iam_policy)
			.select(Permission::as_select())
			.load(conn)?;

		let actions = PermissionIAMAction::belonging_to(&permissions)
			.inner_join(
				iam_actions::table.on(iam_actions::key.eq(permissions_iam_actions::iam_action_key)),
			)
			.select(PermissionIAMAction::as_select())
			.load::<PermissionIAMAction>(conn)?;

		let permissions_with_actions: Vec<(Permission, Vec<String>)> = actions
			.grouped_by(&permissions)
			.into_iter()
			.zip(permissions)
			.map(|(actions, permission)| {
				(
					permission,
					actions
						.into_iter()
						.map(|action| action.iam_action_key)
						.collect(),
				)
			})
			.collect();

		Ok((iam_policy, permissions_with_actions))
	}

	pub fn find(
		conn: &mut PgConnection,
		team_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<(Self, Vec<(Permission, Vec<String>)>)>, i64), AppError> {
		let iam_policies = iam_policies::table
			.select(IAMPolicy::as_select())
			.filter(iam_policies::team_id.eq(team_id))
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.load::<IAMPolicy>(conn)?;

		let permissions = Permission::belonging_to(&iam_policies)
			.select(Permission::as_select())
			.load(conn)?;

		let actions = PermissionIAMAction::belonging_to(&permissions)
			.inner_join(
				iam_actions::table.on(iam_actions::key.eq(permissions_iam_actions::iam_action_key)),
			)
			.select(PermissionIAMAction::as_select())
			.load::<PermissionIAMAction>(conn)?;

		let permissions_with_actions: Vec<(Permission, Vec<String>)> = actions
			.grouped_by(&permissions)
			.into_iter()
			.zip(permissions)
			.map(|(actions, permission)| {
				(
					permission,
					actions
						.into_iter()
						.map(|action| action.iam_action_key)
						.collect(),
				)
			})
			.collect();

		let policies_with_permissions: Vec<(IAMPolicy, Vec<(Permission, Vec<String>)>)> =
			permissions_with_actions
				.grouped_by(&iam_policies)
				.into_iter()
				.zip(iam_policies.clone())
				.map(|(permissions, policy)| (policy, permissions))
				.collect();

		let total_elements = iam_policies::table.count().get_result::<i64>(conn)?;

		Ok((policies_with_permissions, total_elements))
	}

	pub fn update(
		conn: &mut PgConnection,
		role_id: Uuid,
		changeset: UpdateIAMPolicy,
	) -> Result<Self, AppError> {
		let target = iam_policies::table.find(role_id);
		let user = diesel::update(target)
			.set(changeset)
			.get_result::<IAMPolicy>(conn)?;
		Ok(user)
	}

	pub fn remove(conn: &mut PgConnection, role_id: Uuid) -> Result<(), AppError> {
		let target = iam_policies::table.find(role_id);
		diesel::delete(target).get_result::<IAMPolicy>(conn)?;
		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = iam_policies)]
pub struct CreateIAMPolicy<'a> {
	pub name: &'a str,
	pub team_id: Uuid,
}

#[derive(AsChangeset, Debug, Deserialize)]
#[diesel(table_name = iam_policies)]
pub struct UpdateIAMPolicy {
	pub name: Option<String>,
}
