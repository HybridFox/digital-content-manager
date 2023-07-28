use crate::errors::AppError;
use crate::schema::assets;
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = assets)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Asset {
	pub id: Uuid,
	pub site_id: Uuid,
	pub name: String,
	pub description: Option<String>,
	pub file_reference: String,
	pub file_extension: String,
	pub file_mime: String,
	pub file_size: i64,
	pub deleted: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl Asset {
	pub fn create(conn: &mut PgConnection, record: CreateAsset) -> Result<Asset, AppError> {
		use diesel::prelude::*;

		let asset = diesel::insert_into(assets::table)
			.values(&record)
			.returning(Asset::as_returning())
			.get_result::<Asset>(conn)?;

		Ok(asset)
	}

	pub fn find_one(conn: &mut PgConnection, _site_id: Uuid, id: Uuid) -> Result<Self, AppError> {
		let t = assets::table.find(id);
		let site = t.first(conn)?;
		Ok(site)
	}

	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let assets = assets::table
			.select(Asset::as_select())
			.filter(assets::site_id.eq(site_id))
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.load::<Asset>(conn)?;
		let total_elements = assets::table.count().get_result::<i64>(conn)?;

		Ok((assets, total_elements))
	}

	pub fn update(
		conn: &mut PgConnection,
		site_id: Uuid,
		changeset: UpdateAsset,
	) -> Result<Self, AppError> {
		let target = assets::table.find(site_id);
		let user = diesel::update(target)
			.set(changeset)
			.get_result::<Asset>(conn)?;
		Ok(user)
	}

	pub fn remove(conn: &mut PgConnection, site_id: Uuid) -> Result<(), AppError> {
		let target = assets::table.find(site_id);
		diesel::delete(target).get_result::<Asset>(conn)?;
		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = assets)]
pub struct CreateAsset<'a> {
	pub name: &'a str,
	pub description: &'a str,
	pub site_id: Uuid,
	pub file_reference: &'a str,
	pub file_extension: &'a str,
	pub file_mime: &'a str,
	pub file_size: i64,
}

#[derive(AsChangeset, Debug, Deserialize)]
#[diesel(table_name = assets)]
pub struct UpdateAsset {
	pub name: Option<String>,
	pub description: Option<String>,
}
