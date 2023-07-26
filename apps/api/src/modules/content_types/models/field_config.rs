use std::collections::HashMap;
use std::io::Write;

use chrono::NaiveDateTime;
use diesel::pg::{PgValue, Pg};
use diesel::deserialize::{self, FromSql};
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::{prelude::*, FromSqlRow, AsExpression};
use serde_json::Value;
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use tracing::{instrument};

use crate::errors::AppError;
use crate::modules::content_components::models::content_component::ContentComponent;
use crate::modules::content_types::models::field::FieldModel;
use crate::schema::{field_config, sql_types::FieldConfigTypes};

#[derive(Selectable, Queryable, Debug, Identifiable, Associations, Clone)]
#[diesel(belongs_to(FieldModel, foreign_key = field_id))]
#[diesel(table_name = field_config)]
#[diesel(primary_key(id))]
pub struct FieldConfig {
	pub id: Uuid,
	pub field_id: Uuid,
	pub config_key: String,
	pub config_type: FieldConfigTypeEnum,
	pub content: Option<String>,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

#[derive(Debug, PartialEq, FromSqlRow, AsExpression, Eq, Clone, Deserialize)]
#[diesel(sql_type = FieldConfigTypes)]
pub enum FieldConfigTypeEnum {
	Text,
	Json,
	Fields,
}

impl ToSql<FieldConfigTypes, Pg> for FieldConfigTypeEnum {
	fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
		match *self {
			FieldConfigTypeEnum::Text => out.write_all(b"TEXT")?,
			FieldConfigTypeEnum::Json => out.write_all(b"JSON")?,
			FieldConfigTypeEnum::Fields => out.write_all(b"FIELDS")?,
		}
		Ok(IsNull::No)
	}
}

impl FromSql<FieldConfigTypes, Pg> for FieldConfigTypeEnum {
	fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
		match bytes.as_bytes() {
			b"TEXT" => Ok(FieldConfigTypeEnum::Text),
			b"JSON" => Ok(FieldConfigTypeEnum::Json),
			b"FIELDS" => Ok(FieldConfigTypeEnum::Fields),
			_ => Err("Unrecognized enum variant".into()),
		}
	}
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum FieldConfigContent {
	Text(String),
	Json(serde_json::Value),
	Fields(
		Vec<(
			FieldModel,
			ContentComponent,
			HashMap<String, FieldConfigContent>,
		)>,
	),
}

impl FieldConfig {
	#[instrument(skip(conn))]
	pub fn find_one(conn: &mut PgConnection, _site_id: Uuid, id: Uuid) -> Result<Self, AppError> {
		let content_type = field_config::table.find(id).first::<Self>(conn)?;
		Ok(content_type)
	}

	#[instrument(skip(conn))]
	pub fn upsert(
		conn: &mut PgConnection,
		field_id: Uuid,
		config: HashMap<String, Value>,
	) -> Result<Vec<Self>, AppError> {
		let existing_config = field_config::table.filter(field_config::field_id.eq(field_id));
		diesel::delete(existing_config).execute(conn)?;

		let iam_policies = config
			.into_iter()
			.map(|(config_key, content)| {
				let stringify_result = serde_json::to_string(&content);
				match stringify_result {
					Ok(result) => CreateFieldConfig {
						field_id,
						config_key,
						content: result,
						config_type: FieldConfigTypeEnum::Json,
					},
					Err(_) => CreateFieldConfig {
						field_id,
						config_key,
						content: content.to_string(),
						config_type: FieldConfigTypeEnum::Text,
					},
				}
			})
			.collect::<Vec<CreateFieldConfig>>();

		let field_config = diesel::insert_into(field_config::table)
			.values(iam_policies)
			.returning(Self::as_returning())
			.get_results(conn)?;

		Ok(field_config)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = field_config)]
pub struct CreateFieldConfig {
	field_id: Uuid,
	config_key: String,
	config_type: FieldConfigTypeEnum,
	content: String,
}
