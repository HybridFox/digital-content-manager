use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;

use crate::modules::iam_policies::models::permission::Permission;
use crate::modules::iam_actions::models::iam_action::IAMAction;

use crate::errors::AppError;
use crate::schema::{permissions_iam_actions};

#[derive(Selectable, Queryable, Debug, Identifiable, Associations)]
#[diesel(belongs_to(Permission))]
#[diesel(belongs_to(IAMAction, foreign_key = iam_action_key))]
#[diesel(table_name = permissions_iam_actions)]
#[diesel(primary_key(iam_action_key, permission_id))]
pub struct PermissionIAMAction {
	pub iam_action_key: String,
	pub permission_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl PermissionIAMAction {
	pub fn create(
		conn: &mut PgConnection,
		permission_id: Uuid,
		iam_action_keys: Vec<String>,
	) -> Result<Vec<Self>, AppError> {
		let actions = iam_action_keys
			.into_iter()
			.map(|iam_action_key| CreatePermissionIAMAction {
				iam_action_key,
				permission_id,
			})
			.collect::<Vec<CreatePermissionIAMAction>>();

		let permissions_iam_actions = diesel::insert_into(permissions_iam_actions::table)
			.values(actions)
			.returning(PermissionIAMAction::as_returning())
			.get_results(conn)?;

		Ok(permissions_iam_actions)
	}

	pub fn remove_by_permission_ids(conn: &mut PgConnection, permission_ids: Vec<Uuid>) -> Result<(), AppError> {
		let target = permissions_iam_actions::table.filter(permissions_iam_actions::permission_id.eq_any(permission_ids));
		diesel::delete(target).execute(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = permissions_iam_actions)]
pub struct CreatePermissionIAMAction {
	pub iam_action_key: String,
	pub permission_id: Uuid,
}
