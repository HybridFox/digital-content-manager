use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;

use crate::modules::roles::models::role::Role;

use crate::errors::AppError;
use crate::schema::roles_iam_policies;

#[derive(Identifiable, Selectable, Queryable, Associations, Debug, Clone)]
#[diesel(belongs_to(Role))]
#[diesel(table_name = roles_iam_policies)]
#[diesel(primary_key(iam_policy_id, role_id))]
pub struct RoleIAMPolicy {
	pub iam_policy_id: Uuid,
	pub role_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl RoleIAMPolicy {
	pub fn upsert_for_role(
		conn: &mut PgConnection,
		role_id: Uuid,
		iam_policy_ids: Vec<Uuid>,
	) -> Result<Vec<Self>, AppError> {
		// Clear existing
		let target = roles_iam_policies::table.filter(roles_iam_policies::role_id.eq(role_id));
		diesel::delete(target).execute(conn)?;

		let iam_policies = iam_policy_ids
			.into_iter()
			.map(|iam_policy_id| CreateRoleIAMPolicy {
				iam_policy_id,
				role_id,
			})
			.collect::<Vec<CreateRoleIAMPolicy>>();

		let role_iam_policies = diesel::insert_into(roles_iam_policies::table)
			.values(iam_policies)
			.returning(RoleIAMPolicy::as_returning())
			.get_results(conn)?;

		Ok(role_iam_policies)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = roles_iam_policies)]
pub struct CreateRoleIAMPolicy {
	pub iam_policy_id: Uuid,
	pub role_id: Uuid,
}
