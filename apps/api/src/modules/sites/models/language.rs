use crate::errors::AppError;
use crate::schema::languages;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = languages)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Language {
	pub id: Uuid,
	pub key: String,
	pub name: String,
}

impl Language {
	pub fn find_one(conn: &mut PgConnection, id: Uuid) -> Result<Self, AppError> {
		let t = languages::table.find(id);
		let site = t.first(conn)?;
		Ok(site)
	}

	pub fn find(
		conn: &mut PgConnection,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let languages = languages::table
			.select(Language::as_select())
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.load::<Language>(conn)?;
		let total_elements = languages::table.count().get_result::<i64>(conn)?;

		Ok((languages, total_elements))
	}
}
