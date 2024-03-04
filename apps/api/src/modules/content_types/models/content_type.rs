use std::collections::HashMap;
use std::io::Write;

use chrono::NaiveDateTime;
use diesel::{prelude::*, FromSqlRow, AsExpression};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use tracing::instrument;
use diesel::pg::{Pg, PgValue};
use diesel::deserialize::{self, FromSql};
use diesel::serialize::{self, IsNull, Output, ToSql};

use crate::errors::AppError;
use crate::modules::content::models::content::Content;
use crate::modules::content_components::models::content_component::{
	ContentComponent, PopulatedContentComponent,
};
use crate::schema::{content, fields};
use crate::schema::{
	content_types, sites_content_types, content_components, sql_types::ContentTypeKinds,
};

use super::compartment::CompartmentModel;
use super::field::FieldModel;
use super::field_config::{FieldConfig, FieldConfigContent};
use super::site_content_type::SiteContentType;

pub type PopulatedContentTypeField = (
	FieldModel,
	PopulatedContentComponent,
	HashMap<String, FieldConfigContent>,
);

#[derive(
	Debug, PartialEq, FromSqlRow, AsExpression, Eq, Clone, Deserialize, Serialize, ToSchema, Copy,
)]
#[diesel(sql_type = ContentTypeKinds)]
#[allow(non_camel_case_types)]
pub enum ContentTypeKindEnum {
	CONTENT,
	PAGE,
	CONTENT_BLOCK,
}

impl ToSql<ContentTypeKinds, Pg> for ContentTypeKindEnum {
	fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
		match *self {
			ContentTypeKindEnum::CONTENT => out.write_all(b"CONTENT")?,
			ContentTypeKindEnum::PAGE => out.write_all(b"PAGE")?,
			ContentTypeKindEnum::CONTENT_BLOCK => out.write_all(b"CONTENT_BLOCK")?,
		}
		Ok(IsNull::No)
	}
}

impl FromSql<ContentTypeKinds, Pg> for ContentTypeKindEnum {
	fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
		match bytes.as_bytes() {
			b"CONTENT" => Ok(ContentTypeKindEnum::CONTENT),
			b"PAGE" => Ok(ContentTypeKindEnum::PAGE),
			b"CONTENT_BLOCK" => Ok(ContentTypeKindEnum::CONTENT_BLOCK),
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
	pub workflow_id: Uuid,
	pub slug: String,
	pub deleted: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl ContentType {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		values: CreateContentType,
	) -> Result<Self, AppError> {
		let content_type = diesel::insert_into(content_types::table)
			.values(values)
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
	) -> Result<(Self, Vec<PopulatedContentTypeField>, Vec<CompartmentModel>), AppError> {
		let content_type = content_types::table.find(id).first::<Self>(conn)?;
		let fields_with_config = Self::find_fields(conn, &vec![content_type.clone()])?;
		let compartments = Self::find_compartments(conn, &content_type)?;

		Ok((content_type, fields_with_config, compartments))
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
		kind: Option<ContentTypeKindEnum>,
		include_occurrences: Option<bool>,
	) -> Result<(Vec<(Self, i64)>, i64), AppError> {
		let query = {
			let mut query = sites_content_types::table
				.filter(sites_content_types::site_id.eq(site_id))
				.inner_join(
					content_types::table
						.on(content_types::id.eq(sites_content_types::content_type_id)),
				)
				.into_boxed();

			if let Some(kind) = kind {
				query = query.filter(content_types::kind.eq(kind));
			}

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let content_types = query
			.select(ContentType::as_select())
			.load::<ContentType>(conn)?;

		let content = Content::belonging_to(&content_types)
			.distinct_on(content::translation_id)
			.select(Content::as_select())
			.load::<Content>(conn)?;
		let grouped_content = content.grouped_by(&content_types);

		let content_types_with_occurences = content_types
			.into_iter()
			.zip(grouped_content)
			.map(|(content_type, content_items)| (content_type, content_items.len() as i64))
			.collect::<Vec<(ContentType, i64)>>();

		let total_elements = sites_content_types::table
			.filter(sites_content_types::site_id.eq(site_id))
			.count()
			.get_result::<i64>(conn)?;

		Ok((content_types_with_occurences, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		site_id: Uuid,
		id: Uuid,
		changeset: UpdateContentType,
	) -> Result<(Self, Vec<PopulatedContentTypeField>, Vec<CompartmentModel>), AppError> {
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
	) -> Result<Vec<PopulatedContentTypeField>, AppError> {
		let all_content_components = content_components::table
			.select(ContentComponent::as_select())
			.load::<ContentComponent>(conn)?;

		let fields = FieldModel::belonging_to(content_types)
			.order(fields::sequence_number)
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

				let populated_cc =
					ContentComponent::populate_fields(conn, vec![content_component.unwrap()])?;

				Ok((
					field,
					populated_cc.first().unwrap().clone(),
					populated_field_configs,
				))
			})
			.collect::<Result<Vec<PopulatedContentTypeField>, AppError>>()?;

		Ok(fields_with_config)
	}

	#[instrument(skip(conn))]
	pub fn find_compartments(
		conn: &mut PgConnection,
		content_type: &Self,
	) -> Result<Vec<CompartmentModel>, AppError> {
		let compartments = CompartmentModel::belonging_to(content_type)
			.select(CompartmentModel::as_select())
			.load::<CompartmentModel>(conn)?;

		Ok(compartments)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = content_types)]
pub struct CreateContentType {
	pub name: String,
	pub description: String,
	pub slug: String,
	pub workflow_id: Uuid,
	pub kind: ContentTypeKindEnum,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = content_types)]
pub struct UpdateContentType {
	pub name: Option<String>,
	pub description: Option<String>,
}
