use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

use crate::{modules::content_components::enums::data_type::DataTypeEnum, schema::content_fields};

#[derive(
	Selectable, Queryable, Debug, Identifiable, Clone, Deserialize, Serialize, QueryableByName,
)]
#[diesel(table_name = content_fields)]
#[diesel(primary_key(id))]
pub struct ContentField {
	pub id: Uuid,
	pub name: String,
	pub value: Option<Value>,
	pub content_component_id: Option<Uuid>,
	pub parent_id: Option<Uuid>,
	pub source_id: Uuid,
	pub sequence_number: Option<i32>,
	pub data_type: DataTypeEnum,
}

#[derive(Insertable, Debug, Deserialize, Clone)]
#[diesel(table_name = content_fields)]
pub struct CreateContentField {
	pub id: Option<Uuid>,
	pub name: String,
	pub value: Option<Value>,
	pub content_component_id: Option<Uuid>,
	pub parent_id: Option<Uuid>,
	pub source_id: Uuid,
	pub sequence_number: Option<i32>,
	pub data_type: DataTypeEnum,
}
