use crate::errors::AppError;
use crate::schema::storage_repositories;
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = storage_repositories)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct StorageRepository {
	pub id: Uuid,
	pub name: String,
	pub kind: String,
	pub configuration: Value,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl StorageRepository {
	pub fn create(conn: &mut PgConnection, record: CreateStorageRepository) -> Result<Self, AppError> {
		use diesel::prelude::*;

		let asset = diesel::insert_into(storage_repositories::table)
			.values(&record)
			.returning(StorageRepository::as_returning())
			.get_result::<StorageRepository>(conn)?;

		Ok(asset)
	}

	pub fn find_one(conn: &mut PgConnection, id: Uuid) -> Result<Self, AppError> {
		let t = storage_repositories::table.find(id);
		let site = t.first(conn)?;
		Ok(site)
	}

	pub fn find(
		conn: &mut PgConnection,
		_site_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let storage_repositories = storage_repositories::table
			.select(StorageRepository::as_select())
			// .filter(storage_repositories::site_id.eq(site_id))
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.load::<StorageRepository>(conn)?;
		let total_elements = storage_repositories::table.count().get_result::<i64>(conn)?;

		Ok((storage_repositories, total_elements))
	}

	pub fn update(
		conn: &mut PgConnection,
		storage_repository_id: Uuid,
		changeset: UpdateStorageRepository,
	) -> Result<Self, AppError> {
		let target = storage_repositories::table.find(storage_repository_id);
		let user = diesel::update(target)
			.set(changeset)
			.get_result::<StorageRepository>(conn)?;
		Ok(user)
	}

	pub fn remove(conn: &mut PgConnection, storage_repository_id: Uuid) -> Result<(), AppError> {
		let target = storage_repositories::table.find(storage_repository_id);
		diesel::delete(target).get_result::<StorageRepository>(conn)?;
		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = storage_repositories)]
pub struct CreateStorageRepository<'a> {
	pub name: &'a str,
	pub kind: &'a str,
	pub configuration: Value,
}

#[derive(AsChangeset, Debug, Deserialize)]
#[diesel(table_name = storage_repositories)]
pub struct UpdateStorageRepository {
	pub name: Option<String>,
	pub configuration: Option<Value>,
	pub updated_at: NaiveDateTime,
}
