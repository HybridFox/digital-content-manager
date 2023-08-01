use std::collections::HashMap;
use std::io::Write;

use tracing::instrument;
use diesel::{prelude::*, FromSqlRow, AsExpression};
use slug::slugify;
use diesel::deserialize::{self, FromSql};
use diesel::pg::{Pg, PgValue};
use serde::{Deserialize, Serialize};
use crate::modules::content_components::models::content_component::{ContentComponent, PopulatedContentComponent};
use crate::modules::content_types::models::content_type::ContentType;
use crate::schema::field_config;
use uuid::Uuid;
use diesel::serialize::{self, IsNull, Output, ToSql};

use crate::errors::AppError;
use crate::schema::{fields, content_components, sql_types::FieldTypes};

use super::field_config::{FieldConfig, FieldConfigContent};

#[derive(Debug, PartialEq, FromSqlRow, AsExpression, Eq, Clone, Deserialize, Serialize)]
#[diesel(sql_type = FieldTypes)]
pub enum FieldTypeEnum {
	ContentTypeField,
	ContentCompentField,
	ContentCompentConfigField,
}

impl ToSql<FieldTypes, Pg> for FieldTypeEnum {
	fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
		match *self {
			FieldTypeEnum::ContentTypeField => out.write_all(b"CONTENT-TYPE_FIELD")?,
			FieldTypeEnum::ContentCompentField => {
				out.write_all(b"CONTENT-COMPONENT_FIELD")?
			}
			FieldTypeEnum::ContentCompentConfigField => {
				out.write_all(b"CONTENT-COMPONENT_CONFIG-FIELD")?
			}
		}
		Ok(IsNull::No)
	}
}

impl FromSql<FieldTypes, Pg> for FieldTypeEnum {
	fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
		match bytes.as_bytes() {
			b"CONTENT-TYPE_FIELD" => Ok(FieldTypeEnum::ContentTypeField),
			b"CONTENT-COMPONENT_FIELD" => Ok(FieldTypeEnum::ContentCompentField),
			b"CONTENT-COMPONENT_CONFIG-FIELD" => Ok(FieldTypeEnum::ContentCompentConfigField),
			_ => Err("Unrecognized enum variant".into()),
		}
	}
}

#[derive(Selectable, Queryable, Debug, Identifiable, Associations, Clone, Deserialize, Serialize)]
#[diesel(belongs_to(ContentComponent, foreign_key = content_component_id))]
#[diesel(belongs_to(ContentType, foreign_key = parent_id))]
#[diesel(table_name = fields)]
#[diesel(primary_key(id))]
pub struct FieldModel {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub description: Option<String>,
	pub min: i32,
	pub max: i32,
	pub hidden: bool,
	pub multi_language: bool,
	pub field_type: FieldTypeEnum,
	pub parent_id: Uuid,
	pub content_component_id: Uuid,
}

impl FieldModel {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		parent_id: Uuid,
		content_component_id: Uuid,
		field_type: FieldTypeEnum,
		name: &String,
	) -> Result<
		(
			Self,
			PopulatedContentComponent,
			HashMap<String, FieldConfigContent>,
		),
		AppError,
	> {
		let field = diesel::insert_into(fields::table)
			.values(CreateField {
				name: name.to_owned(),
				slug: slugify(name),
				parent_id,
				content_component_id,
				field_type,
			})
			.returning(FieldModel::as_returning())
			.get_result(conn)?;

		let result = Self::find_one(conn, site_id, field.id)?;

		Ok(result)
	}

	#[instrument(skip(conn))]
	pub fn find_one(
		conn: &mut PgConnection,
		_site_id: Uuid,
		id: Uuid,
	) -> Result<
		(
			Self,
			PopulatedContentComponent,
			HashMap<String, FieldConfigContent>,
		),
		AppError,
	> {
		let field = fields::table.find(id).first::<Self>(conn)?;

		let field_config = FieldConfig::belonging_to(&field)
			.select(FieldConfig::as_select())
			.load::<FieldConfig>(conn)?;

		let content_component = ContentComponent::find_one(conn, None, field.content_component_id)?;
		let populated_content_components =
			ContentComponent::populate_fields(conn, vec![content_component])?;
		let populated_field_config = ContentComponent::populate_config(conn, field_config)?;

		Ok((
			field,
			populated_content_components.first().unwrap().clone(),
			populated_field_config,
		))
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		_site_id: Uuid,
		parent_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<(Self, PopulatedContentComponent, HashMap<String, FieldConfigContent>)>, i64), AppError> {
		let fields = fields::table
			.filter(fields::parent_id.eq(parent_id))
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.select(FieldModel::as_select())
			.load::<FieldModel>(conn)?;

		let fields_with_config = Self::populate_fields(conn, fields)?;
		let total_elements = fields::table
			.filter(fields::parent_id.eq(parent_id))
			.count()
			.get_result::<i64>(conn)?;

		Ok((fields_with_config, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn populate_fields(
		conn: &mut PgConnection,
		fields: Vec<Self>
	) -> Result<Vec<(Self, PopulatedContentComponent, HashMap<String, FieldConfigContent>)>, AppError> {
		let all_content_components = content_components::table
			.select(ContentComponent::as_select())
			.load::<ContentComponent>(conn)?;

		let field_config = FieldConfig::belonging_to(&fields)
			.select(FieldConfig::as_select())
			.load::<FieldConfig>(conn)?;

		let grouped_config: Vec<Vec<FieldConfig>> = field_config.grouped_by(&fields);
		let fields_with_config = fields
			.into_iter()
			.zip(grouped_config)
			.map(|(field, field_configs)| {
				let content_component = all_content_components
					.iter()
					.find(|cp| cp.id == field.content_component_id)
					.map(|cp| cp.to_owned());
				let populated_field_configs = ContentComponent::populate_config(conn, field_configs)?;
				let populated_content_components = ContentComponent::populate_fields(conn, vec![content_component.unwrap()])?;
				
				Ok((field, populated_content_components.first().unwrap().to_owned(), populated_field_configs))
			})
			.collect::<Result<Vec<_>, AppError>>()?;

		Ok(fields_with_config)
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		site_id: Uuid,
		id: Uuid,
		changeset: UpdateField,
	) -> Result<
		(
			Self,
			PopulatedContentComponent,
			HashMap<String, FieldConfigContent>,
		),
		AppError,
	> {
		let target = fields::table.find(id);
		diesel::update(target)
			.set(changeset)
			.get_result::<Self>(conn)?;

		let field = Self::find_one(conn, site_id, id)?;

		Ok(field)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, field_id: Uuid) -> Result<(), AppError> {
		let target = fields::table.filter(fields::id.eq(field_id));
		diesel::delete(target).execute(conn)?;

		let target = field_config::table.filter(field_config::field_id.eq(field_id));
		diesel::delete(target).execute(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = fields)]
pub struct CreateField {
	name: String,
	slug: String,
	parent_id: Uuid,
	content_component_id: Uuid,
	field_type: FieldTypeEnum,
}

#[derive(AsChangeset, Insertable, Debug, Deserialize)]
#[diesel(table_name = fields)]
#[serde(rename_all = "camelCase")]
pub struct UpdateField {
	pub name: Option<String>,
	pub description: Option<String>,
	pub min: Option<i32>,
	pub max: Option<i32>,
	pub hidden: Option<bool>,
	pub multi_language: Option<bool>,
}
