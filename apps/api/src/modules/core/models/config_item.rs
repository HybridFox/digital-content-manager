use diesel::prelude::*;
use serde::Deserialize;
use serde_json::Value;
use uuid::Uuid;
use tracing::instrument;

use crate::errors::AppError;
use crate::schema::config_items;

#[derive(Identifiable, Selectable, Queryable, Debug, Clone)]
#[diesel(table_name = config_items)]
#[diesel(primary_key(id))]
pub struct ConfigItem {
	pub id: Uuid,
	pub key: String,
	pub module_name: Option<String>,
	pub site_id: Option<Uuid>,
	pub value: Option<Value>,
}

impl ConfigItem {
	#[instrument(skip(conn))]
	pub fn upsert(
		conn: &mut PgConnection,
		site_id: Option<Uuid>,
		module_name: Option<String>,
		values: Vec<CreateConfigItem>,
	) -> Result<Vec<Self>, AppError> {
		let existing_config_items = config_items::table.filter(config_items::site_id.eq(site_id));
		diesel::delete(existing_config_items).execute(conn)?;

		let created_items = diesel::insert_into(config_items::table)
			.values(values)
			.returning(ConfigItem::as_returning())
			.get_results(conn)?;

		Ok(created_items)
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		site_id: Option<Uuid>,
		module_name: Option<String>,
	) -> Result<Vec<Self>, AppError> {
		let query = {
			let mut query = config_items::table.into_boxed();

			if site_id.is_none() {
				query = query.filter(config_items::site_id.is_null())
			} else {
				query = query.filter(config_items::site_id.eq(site_id))
			};

			if module_name.is_none() {
				query = query.filter(config_items::module_name.is_null())
			} else {
				query = query.filter(config_items::module_name.eq(module_name))
			};

			query
		};

		let config_items = query
			.select(ConfigItem::as_select())
			.load::<ConfigItem>(conn)?;

		Ok(config_items)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, config_item_id: Uuid) -> Result<(), AppError> {
		diesel::delete(config_items::table.filter(config_items::id.eq(config_item_id)))
			.get_result::<ConfigItem>(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = config_items)]
pub struct CreateConfigItem {
	pub key: String,
	pub value: Option<Value>,
	pub site_id: Option<Uuid>,
	pub module_name: Option<String>,
}
