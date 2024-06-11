use chrono::NaiveDateTime;
use diesel::deserialize::FromSql;
use diesel::pg::{Pg, PgValue};
use diesel::serialize::{Output, ToSql};
use diesel::sql_types::Jsonb;
use diesel::{prelude::*, AsExpression, FromSqlRow};
use serde::Deserialize;
use uuid::Uuid;

use crate::modules::iam_policies::models::permission::Permission;

use crate::errors::AppError;
use crate::schema::permissions_iam_conditions;

#[derive(FromSqlRow, AsExpression, serde::Serialize, serde::Deserialize, Debug, Default)]
#[diesel(sql_type = Jsonb)]
pub struct PermissionIAMConditionValue {
	pub error_info: String,
	pub suggested_id_tag: String,
}

impl FromSql<Jsonb, Pg> for PermissionIAMConditionValue {
	fn from_sql(bytes: PgValue) -> diesel::deserialize::Result<Self> {
		let value = <serde_json::Value as FromSql<Jsonb, Pg>>::from_sql(bytes)?;
		Ok(serde_json::from_value(value)?)
	}
}

impl ToSql<Jsonb, Pg> for PermissionIAMConditionValue {
	fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> diesel::serialize::Result {
		let json_value = serde_json::to_value(self)?;
		<serde_json::Value as ToSql<diesel::sql_types::Jsonb, Pg>>::to_sql(
			&json_value,
			&mut out.reborrow(),
		)
	}
}

#[derive(Identifiable, Selectable, Queryable, Associations, Debug)]
#[diesel(belongs_to(Permission))]
// #[diesel(belongs_to(Action))]
#[diesel(table_name = permissions_iam_conditions)]
#[diesel(primary_key(iam_condition_key, permission_id))]
pub struct PermissionIAMCondition {
	pub iam_condition_key: String,
	pub permission_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
	pub value: PermissionIAMConditionValue,
}

impl PermissionIAMCondition {
	pub fn create_for_permission(
		conn: &mut PgConnection,
		permission_id: Uuid,
		iam_condition_keys: Vec<String>,
	) -> Result<Vec<Self>, AppError> {
		let iam_conditions = iam_condition_keys
			.into_iter()
			.map(|iam_condition_key| CreatePermissionIAMCondition {
				iam_condition_key,
				permission_id,
				value: PermissionIAMConditionValue {
					error_info: "".to_owned(),
					suggested_id_tag: "".to_owned(),
				},
			})
			.collect::<Vec<CreatePermissionIAMCondition>>();

		let permissions_iam_conditions = diesel::insert_into(permissions_iam_conditions::table)
			.values(iam_conditions)
			.returning(PermissionIAMCondition::as_returning())
			.get_results(conn)?;

		Ok(permissions_iam_conditions)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = permissions_iam_conditions)]
pub struct CreatePermissionIAMCondition {
	pub iam_condition_key: String,
	pub permission_id: Uuid,
	pub value: PermissionIAMConditionValue,
}
