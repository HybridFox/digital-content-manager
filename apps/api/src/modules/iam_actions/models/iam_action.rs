use crate::{errors::AppError, modules::iam_actions::seeds::actions::IAM_ACTION_SEEDS};
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
		let query = {
			let mut query = iam_actions::table
				.select(IAMAction::as_select())
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let iam_actions = query.load::<IAMAction>(conn)?;
		let total_elements = iam_actions::table.count().get_result::<i64>(conn)?;

		Ok((iam_actions, total_elements))
	}

	pub fn upsert(conn: &mut PgConnection) -> () {
		IAM_ACTION_SEEDS.into_iter().for_each(|item| {
			let _ = diesel::insert_into(iam_actions::table)
				.values(&item)
				.on_conflict(iam_actions::key)
				.do_update()
				.set(&item)
				.execute(conn);
		})
	}
}

#[derive(Insertable, Debug, Deserialize, AsChangeset)]
#[diesel(table_name = iam_actions)]
pub struct CreateIAMAction<'a> {
	pub key: &'a str,
	pub description: Option<String>,
}
