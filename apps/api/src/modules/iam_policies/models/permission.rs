use chrono::NaiveDateTime;
use diesel::{
	prelude::*,
	FromSqlRow, AsExpression,
	deserialize::FromSql,
	sql_types::Jsonb,
	pg::{Pg, PgValue},
	serialize::{Output, ToSql},
};
use serde::Deserialize;
use uuid::Uuid;

use crate::modules::iam_policies::models::iam_policy::IAMPolicy;
use crate::{
	schema::{permissions, iam_actions, iam_conditions},
	errors::AppError,
	modules::{
		iam_actions::models::iam_action::{IAMAction},
		iam_conditions::models::iam_condition::IAMCondition,
	},
};

use super::{
	permission_iam_action::PermissionIAMAction, permission_iam_condition::PermissionIAMCondition,
};

#[derive(FromSqlRow, AsExpression, serde::Serialize, serde::Deserialize, Debug, Default, Clone)]
#[diesel(sql_type = Jsonb)]
pub struct PermissionResourcesValue(Vec<String>);

impl FromSql<Jsonb, Pg> for PermissionResourcesValue {
	fn from_sql(bytes: PgValue) -> diesel::deserialize::Result<Self> {
		let value = <serde_json::Value as FromSql<Jsonb, Pg>>::from_sql(bytes)?;
		Ok(serde_json::from_value(value)?)
	}
}

impl ToSql<Jsonb, Pg> for PermissionResourcesValue {
	fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> diesel::serialize::Result {
		let json_value = serde_json::to_value(self)?;
		<serde_json::Value as ToSql<diesel::sql_types::Jsonb, Pg>>::to_sql(
			&json_value,
			&mut out.reborrow(),
		)
	}
}

#[derive(Selectable, Queryable, Debug, Identifiable, Associations, Clone)]
#[diesel(belongs_to(IAMPolicy, foreign_key = iam_policy_id))]
#[diesel(table_name = permissions)]
#[diesel(primary_key(id))]
pub struct Permission {
	pub id: Uuid,
	pub iam_policy_id: Uuid,
	pub resources: PermissionResourcesValue,
	pub effect: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl Into<Vec<String>> for PermissionResourcesValue {
	fn into(self) -> Vec<String> {
		self.0
	}
}

impl Permission {
	pub fn create(
		conn: &mut PgConnection,
		iam_policy_id: Uuid,
		resources: Vec<String>,
		effect: String,
	) -> Result<Self, AppError> {
		let permission = diesel::insert_into(permissions::table)
			.values(CreatePermission {
				iam_policy_id,
				resources: PermissionResourcesValue(resources),
				effect,
			})
			.returning(Permission::as_returning())
			.get_result(conn)?;

		Ok(permission)
	}

	pub fn find_one(conn: &mut PgConnection, permission_id: Uuid) -> Result<Self, AppError> {
		let permission: Permission = permissions::table
			.filter(permissions::id.eq(permission_id))
			.select(Self::as_select())
			.get_result(conn)?;

		let _iam_actions = PermissionIAMAction::belonging_to(&permission)
			.inner_join(iam_actions::table)
			.select(IAMAction::as_select())
			.load(conn)?;

		let _iam_conditions = PermissionIAMCondition::belonging_to(&permission)
			.inner_join(iam_conditions::table)
			.select(IAMCondition::as_select())
			.load(conn)?;

		Ok(permission)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = permissions)]
pub struct CreatePermission {
	pub iam_policy_id: Uuid,
	pub resources: PermissionResourcesValue,
	pub effect: String,
}
