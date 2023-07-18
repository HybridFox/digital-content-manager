use diesel::prelude::*;
use crate::modules::content_components::models::content_component::ContentComponent;
use uuid::Uuid;

use crate::errors::AppError;
use crate::schema::fields;

#[derive(Selectable, Queryable, Debug, Identifiable, Associations, Clone)]
#[diesel(belongs_to(ContentComponent, foreign_key = content_component_id))]
#[diesel(table_name = fields)]
#[diesel(primary_key(id))]
pub struct FieldModel {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub parent_id: Uuid,
	pub content_component_id: Uuid,
}

impl FieldModel {
	pub fn find_one(conn: &mut PgConnection, _site_id: Uuid, id: Uuid) -> Result<Self, AppError> {
		let content_type = fields::table.find(id).first::<Self>(conn)?;
		Ok(content_type)
	}
}
