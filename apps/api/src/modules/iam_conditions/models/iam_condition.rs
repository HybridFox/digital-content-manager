use crate::errors::AppError;
use crate::schema::iam_conditions;
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = iam_conditions)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(key))]
pub struct IAMCondition {
	pub key: String,
	pub description: Option<String>,
	pub active: bool,
	pub deprecated: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl IAMCondition {
	pub fn find_one(conn: &mut PgConnection, key: String) -> Result<Self, AppError> {
		let t = iam_conditions::table.find(key);
		let iam_condition = t.first(conn)?;
		Ok(iam_condition)
	}

	pub fn find(
		conn: &mut PgConnection,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let iam_conditions = iam_conditions::table
			.select(IAMCondition::as_select())
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.load::<IAMCondition>(conn)?;
		let total_elements = iam_conditions::table.count().get_result::<i64>(conn)?;

		Ok((iam_conditions, total_elements))
	}
}
