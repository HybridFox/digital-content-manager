use crate::errors::AppError;
use crate::schema::languages;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = languages)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(key))]
pub struct Language {
	pub id: Uuid,
	pub key: String,
	pub name: String,
}

impl Language {
	pub fn find_one(conn: &mut PgConnection, language_id: Uuid) -> Result<Self, AppError> {
		let t = languages::table.find(language_id);
		let language = t.first(conn)?;
		Ok(language)
	}

	pub fn find(
		conn: &mut PgConnection,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let query = {
			let mut query = languages::table
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let languages = query.select(Language::as_select()).load::<Language>(conn)?;
		let total_elements = languages::table
			.count()
			.get_result::<i64>(conn)?;

		Ok((languages, total_elements))
	}
}
