use crate::errors::AppError;
use crate::schema::asset_metadata;
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = asset_metadata)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct AssetMetadata {
	pub id: Uuid,
	pub asset_id: Uuid,
	pub label: String,
	pub value: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl AssetMetadata {
	pub fn create(
		conn: &mut PgConnection,
		record: CreateAssetMetadata,
	) -> Result<AssetMetadata, AppError> {
		use diesel::prelude::*;

		let asset_metadata = diesel::insert_into(asset_metadata::table)
			.values(&record)
			.returning(AssetMetadata::as_returning())
			.get_result::<AssetMetadata>(conn)?;

		Ok(asset_metadata)
	}

	pub fn remove_by_asset_id(
		conn: &mut PgConnection,
		original_asset_id: Uuid,
	) -> Result<(), AppError> {
		use crate::schema::asset_metadata::dsl::*;

		diesel::delete(asset_metadata.filter(asset_id.eq(original_asset_id))).execute(conn)?;
		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = asset_metadata)]
pub struct CreateAssetMetadata<'a> {
	pub asset_id: Uuid,
	pub label: &'a str,
	pub value: &'a str,
}

#[derive(AsChangeset, Debug, Deserialize)]
#[diesel(table_name = asset_metadata)]
pub struct UpdateAssetMetadata {
	pub value: Option<String>,
}
