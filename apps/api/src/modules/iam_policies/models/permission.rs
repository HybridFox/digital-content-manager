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
	schema::permissions,
	errors::AppError
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

		Ok(permission)
	}

	pub fn remove_by_policy_id(conn: &mut PgConnection, policy_id: Uuid) -> Result<Vec<Uuid>, AppError> {
		let permission: Vec<Permission> = permissions::table
			.filter(permissions::iam_policy_id.eq(policy_id))
			.select(Self::as_select())
			.load(conn)?;
		let id_indices: Vec<Uuid> = permission.iter().map(|permission| permission.id).collect();

		let target = permissions::table.filter(permissions::iam_policy_id.eq(policy_id));
		diesel::delete(target).execute(conn)?;

		Ok(id_indices)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = permissions)]
pub struct CreatePermission {
	pub iam_policy_id: Uuid,
	pub resources: PermissionResourcesValue,
	pub effect: String,
}
