use std::collections::HashMap;
use std::io::Write;

use chrono::NaiveDateTime;
use diesel::{prelude::*, FromSqlRow, AsExpression};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use slug::slugify;
use tracing::instrument;
use diesel::pg::{Pg, PgValue};
use diesel::deserialize::{self, FromSql};
use diesel::serialize::{self, IsNull, Output, ToSql};

use crate::errors::AppError;
use crate::modules::content_components::models::content_component::ContentComponent;
use crate::schema::{
	content_types, sites_content_types, content_components, sql_types::ContentTypeKinds,
};

use super::field::FieldModel;
use super::field_config::{FieldConfig, FieldConfigContent};
use super::site_content_type::SiteContentType;

#[derive(Debug, PartialEq, FromSqlRow, AsExpression, Eq, Clone, Deserialize, Serialize)]
#[diesel(sql_type = ContentTypeKinds)]
pub enum ContentTypeKindEnum {
	Content,
	Page,
	ContentBlock,
}

impl ToSql<ContentTypeKinds, Pg> for ContentTypeKindEnum {
	fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
		match *self {
			ContentTypeKindEnum::Content => out.write_all(b"CONTENT")?,
			ContentTypeKindEnum::Page => out.write_all(b"PAGE")?,
			ContentTypeKindEnum::ContentBlock => {
				out.write_all(b"CONTENT_BLOCK")?
			}
		}
		Ok(IsNull::No)
	}
}

impl FromSql<ContentTypeKinds, Pg> for ContentTypeKindEnum {
	fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
		match bytes.as_bytes() {
			b"CONTENT" => Ok(ContentTypeKindEnum::Content),
			b"PAGE" => Ok(ContentTypeKindEnum::Page),
			b"CONTENT_BLOCK" => Ok(ContentTypeKindEnum::ContentBlock),
			_ => Err("Unrecognized enum variant".into()),
		}
	}
}

#[derive(Identifiable, Selectable, Queryable, Debug, Clone)]
#[diesel(table_name = content_types)]
#[diesel(primary_key(id))]
pub struct ContentType {
	pub id: Uuid,
	pub name: String,
	pub description: Option<String>,
	pub kind: ContentTypeKindEnum,
	pub slug: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl ContentType {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		name: &String,
		description: &String,
	) -> Result<Self, AppError> {
		let content_type = diesel::insert_into(content_types::table)
			.values(CreateContentType {
				name: name.to_owned(),
				description: description.to_owned(),
				slug: slugify(name),
			})
			.returning(ContentType::as_returning())
			.get_result(conn)?;

		SiteContentType::create(conn, site_id, content_type.id)?;

		Ok(content_type)
	}

	#[instrument(skip(conn))]
	pub fn find_one(
		conn: &mut PgConnection,
		_site_id: Uuid,
		id: Uuid,
	) -> Result<
		(
			Self,
			Vec<(
				FieldModel,
				ContentComponent,
				HashMap<String, FieldConfigContent>,
			)>,
		),
		AppError,
	> {
		let content_type = content_types::table.find(id).first::<Self>(conn)?;
		let fields_with_config = Self::find_fields(conn, &vec![content_type.clone()])?;

		Ok((content_type, fields_with_config))
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<
		(
			Vec<(
				Self,
				Vec<(
					FieldModel,
					ContentComponent,
					HashMap<String, FieldConfigContent>,
				)>,
			)>,
			i64,
		),
		AppError,
	> {
		let content_types = sites_content_types::table
			.filter(sites_content_types::site_id.eq(site_id))
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.inner_join(
				content_types::table.on(content_types::id.eq(sites_content_types::content_type_id)),
			)
			.select(ContentType::as_select())
			.load::<ContentType>(conn)?;

		let fields_with_config = Self::find_fields(conn, &content_types)?;
		let content_types_with_fields: Vec<(
			Self,
			Vec<(
				FieldModel,
				ContentComponent,
				HashMap<String, FieldConfigContent>,
			)>,
		)> = fields_with_config
			.grouped_by(&content_types)
			.into_iter()
			.zip(content_types)
			.map(|(fields, content_type)| (content_type, fields))
			.collect();

		let total_elements = sites_content_types::table
			.filter(sites_content_types::site_id.eq(site_id))
			.count()
			.get_result::<i64>(conn)?;

		Ok((content_types_with_fields, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		site_id: Uuid,
		id: Uuid,
		changeset: UpdateContentType,
	) -> Result<
		(
			Self,
			Vec<(
				FieldModel,
				ContentComponent,
				HashMap<String, FieldConfigContent>,
			)>,
		),
		AppError,
	> {
		let target = content_types::table.find(id);
		diesel::update(target)
			.set(changeset)
			.get_result::<Self>(conn)?;

		let content_type = Self::find_one(conn, site_id, id)?;

		Ok(content_type)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_type_id: Uuid) -> Result<(), AppError> {
		let target = sites_content_types::table
			.filter(sites_content_types::content_type_id.eq(content_type_id));
		diesel::delete(target).get_result::<SiteContentType>(conn)?;

		let target = content_types::table.filter(content_types::id.eq(content_type_id));
		diesel::delete(target).get_result::<ContentType>(conn)?;
		Ok(())
	}

	#[instrument(skip(conn))]
	pub fn find_fields(
		conn: &mut PgConnection,
		content_types: &Vec<ContentType>,
	) -> Result<
		Vec<(
			FieldModel,
			ContentComponent,
			HashMap<String, FieldConfigContent>,
		)>,
		AppError,
	> {
		let all_content_components = content_components::table
			.select(ContentComponent::as_select())
			.load::<ContentComponent>(conn)?;

		let fields = FieldModel::belonging_to(content_types)
			.select(FieldModel::as_select())
			.load::<FieldModel>(conn)?;

		let field_config = FieldConfig::belonging_to(&fields)
			.select(FieldConfig::as_select())
			.load::<FieldConfig>(conn)?;

		let grouped_config: Vec<Vec<FieldConfig>> = field_config.grouped_by(&fields);
		let fields_with_config = fields
			.into_iter()
			.zip(grouped_config)
			.map(|(field, field_configs)| {
				let populated_field_configs =
					ContentComponent::populate_config(conn, field_configs)?;
				let content_component = all_content_components
					.iter()
					.find(|cp| cp.id == field.content_component_id)
					.map(|cp| cp.to_owned());

				Ok((field, content_component.unwrap(), populated_field_configs))
			})
			.collect::<Result<
				Vec<(
					FieldModel,
					ContentComponent,
					HashMap<String, FieldConfigContent>,
				)>,
				AppError,
			>>()?;

		Ok(fields_with_config)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = content_types)]
pub struct CreateContentType {
	name: String,
	description: String,
	slug: String,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = content_types)]
pub struct UpdateContentType {
	pub name: Option<String>,
	pub description: Option<String>,
}
