use crate::errors::{AppError};
use crate::schema::iam_actions;
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = iam_actions)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(key))]
pub struct IAMAction {
	pub key: String,
	pub description: Option<String>,
	pub active: bool,
	pub deprecated: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl IAMAction {
	pub fn find_one(conn: &mut PgConnection, key: String) -> Result<Self, AppError> {
		let t = iam_actions::table.find(key);
		let iam_action = t.first(conn)?;
		Ok(iam_action)
	}

	pub fn find(
		conn: &mut PgConnection,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let iam_actions = iam_actions::table
			.select(IAMAction::as_select())
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.load::<IAMAction>(conn)?;
		let total_elements = iam_actions::table.count().get_result::<i64>(conn)?;

		Ok((iam_actions, total_elements))
	}
}
