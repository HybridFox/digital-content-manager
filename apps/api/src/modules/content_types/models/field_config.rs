use chrono::NaiveDateTime;
use diesel::prelude::*;
use uuid::Uuid;

use crate::errors::AppError;
use crate::modules::content_types::models::field::FieldModel;
use crate::schema::field_config;

#[derive(Selectable, Queryable, Debug, Identifiable, Associations, Clone)]
#[diesel(belongs_to(FieldModel, foreign_key = field_id))]
#[diesel(table_name = field_config)]
#[diesel(primary_key(id))]
pub struct FieldConfig {
	pub id: Uuid,
	pub field_id: Uuid,
	pub config_key: String,
	pub config_type: String,
	pub content: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl FieldConfig {
	pub fn find_one(conn: &mut PgConnection, _site_id: Uuid, id: Uuid) -> Result<Self, AppError> {
		let content_type = field_config::table.find(id).first::<Self>(conn)?;
		Ok(content_type)
	}
}
