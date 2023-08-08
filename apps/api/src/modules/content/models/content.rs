use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use serde_json::Value;
use uuid::Uuid;
use tracing::instrument;

use crate::errors::AppError;
use crate::modules::content::models::content_field::CreateContentField;
use crate::modules::content_components::enums::data_type::DataTypeEnum;
use crate::modules::content_components::models::content_component::PopulatedContentComponent;
use crate::modules::content_types::models::content_type::{ContentType, PopulatedContentTypeField, ContentTypeKindEnum};
use crate::modules::content_types::models::field::FieldModel;
use crate::modules::sites::models::language::Language;
use crate::schema::{content, content_fields, languages, content_types};

use super::content_field::ContentField;

#[derive(Identifiable, Selectable, Queryable, Debug, Clone)]
#[diesel(table_name = content)]
#[diesel(primary_key(id))]
pub struct Content {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub workflow_state_id: Uuid,
	pub translation_id: Uuid,
	pub language_id: Uuid,
	pub site_id: Uuid,
	pub content_type_id: Uuid,
	pub published: bool,
	pub deleted: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl Content {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_item: CreateContent,
		values: Value,
	) -> Result<(Self, Vec<ContentField>, Language), AppError> {
		let content_item = diesel::insert_into(content::table)
			.values(&content_item)
			.returning(Content::as_returning())
			.get_result(conn)?;

		let (_content_type, fields) =
			ContentType::find_one(conn, site_id, content_item.content_type_id)?;
		Self::upsert_fields(conn, content_item.id, content_item.translation_id, fields, values, &vec![])?;

		let fields = content_fields::table
			.filter(content_fields::source_id.eq_any(vec![content_item.id, content_item.translation_id]))
			.select(ContentField::as_select())
			.load::<ContentField>(conn)?;
		let language = languages::table
			.find(content_item.language_id)
			.first(conn)?;

		Ok((content_item, fields, language))
	}

	#[instrument(skip(conn))]
	pub fn find_one(
		conn: &mut PgConnection,
		_site_id: Uuid,
		id: Uuid,
	) -> Result<(Self, Vec<ContentField>, Language), AppError> {
		let content_item = content::table.find(id).first::<Self>(conn)?;

		let fields = content_fields::table
			.filter(content_fields::source_id.eq_any(vec![content_item.id, content_item.translation_id]))
			.select(ContentField::as_select())
			.load::<ContentField>(conn)?;

		let language = languages::table
			.find(content_item.language_id)
			.first(conn)?;

		Ok((content_item, fields, language))
	}

	#[instrument(skip(conn))]
	pub fn default_values(
		conn: &mut PgConnection,
		_site_id: Uuid,
		translation_id: Uuid,
	) -> Result<Vec<ContentField>, AppError> {
		let fields = content_fields::table
			.filter(content_fields::source_id.eq_any(vec![translation_id]))
			.select(ContentField::as_select())
			.load::<ContentField>(conn)?;

		Ok(fields)
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
		kind: Option<ContentTypeKindEnum>,
		language_id: Option<Uuid>,
		translation_id: Option<Uuid>
	) -> Result<(Vec<(Self, Language, ContentType)>, i64), AppError> {
		let query = {
			let mut query = content::table
				.filter(content::site_id.eq(site_id))
				.inner_join(languages::table.on(languages::id.eq(content::language_id)))
				.inner_join(content_types::table.on(content_types::id.eq(content::content_type_id)))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};
			
			if let Some(kind) = kind {
				query = query.filter(content_types::kind.eq(kind));
			}
			
			if let Some(translation_id) = translation_id {
				query = query.filter(content::translation_id.eq(translation_id));
			}
			
			if let Some(language_id) = language_id {
				query = query.filter(content::language_id.eq(language_id));
			}

			query
		};

		let content = query
			.select((Content::as_select(), Language::as_select(), ContentType::as_select()))
			.load::<(Content, Language, ContentType)>(conn)?;

		let total_elements = content::table
			.filter(content::site_id.eq(site_id))
			.count()
			.get_result::<i64>(conn)?;

		Ok((content, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_type_id: Uuid,
		id: Uuid,
		changeset: UpdateContent,
		values: Value
	) -> Result<(Self, Vec<ContentField>, Language), AppError> {
		let target = content::table.find(id);
		let updated_content_iten = diesel::update(target)
			.set(changeset)
			.returning(Content::as_returning())
			.get_result::<Self>(conn)?;

		let (_content_type, fields) = ContentType::find_one(conn, site_id, content_type_id)?;
		let content_fields = content_fields::table
			.filter(content_fields::source_id.eq_any(vec![id, updated_content_iten.translation_id]))
			.select(ContentField::as_select())
			.load::<ContentField>(conn)?;
		Self::upsert_fields(conn, id, updated_content_iten.translation_id, fields, values, &content_fields)?;

		let content_item = Self::find_one(conn, site_id, id)?;

		Ok(content_item)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_id: Uuid) -> Result<(), AppError> {
		diesel::delete(content::table.filter(content::id.eq(content_id)))
			.get_result::<Content>(conn)?;

		Ok(())
	}

	pub fn upsert_fields(
		conn: &mut PgConnection,
		content_id: Uuid,
		translation_id: Uuid,
		fields: Vec<PopulatedContentTypeField>,
		values: Value,
		existing_content_fields: &Vec<ContentField>
	) -> Result<(), AppError> {
		let target = content_fields::table
			.filter(content_fields::source_id.eq_any(vec![content_id, translation_id]));
		diesel::delete(target).execute(conn)?;

		let values_to_insert = Self::get_field_inserts(content_id, translation_id, None, fields, values, existing_content_fields, false);

		dbg!(&values_to_insert);
		diesel::insert_into(content_fields::table)
			.values(values_to_insert)
			.execute(conn)?;


		Ok(())
	}

	// TODO: Fix dupe function
	// Parent ID => The parent id is either null (root) or the parent_id
	// Source ID => Either the translation ID or the OG content item
	fn get_field_insert(
		content_id: Uuid,
		translation_id: Uuid,
		parent_id: Option<Uuid>,
		slug: String,
		populated_cc: PopulatedContentComponent,
		values: Value,
		field: FieldModel,
		existing_content_fields: &Vec<ContentField>,
		skip_multi_language: bool,
	) -> Vec<CreateContentField> {
		match populated_cc.content_component.data_type {
			DataTypeEnum::TEXT
			| DataTypeEnum::NUMBER
			| DataTypeEnum::BOOLEAN
			| DataTypeEnum::REFERENCE => vec![CreateContentField {
				id: None,
				parent_id,
				source_id: if field.multi_language == true || skip_multi_language { content_id } else { translation_id },
				name: slug.clone(),
				sequence_number: None,
				content_component_id: Some(populated_cc.content_component.id),
				data_type: populated_cc.content_component.data_type,
				value: Some(values[slug.clone()].clone()),
			}],
			DataTypeEnum::ARRAY => todo!(),
			DataTypeEnum::OBJECT => {
				let existing_content_field = existing_content_fields
					.iter()
					.find(|content_field| content_field.parent_id == parent_id && content_field.name == slug);
				let uuid = if existing_content_field.is_some() { existing_content_field.unwrap().id.to_owned() } else { Uuid::new_v4() };

				let parent_field = CreateContentField {
					id: Some(uuid),
					parent_id,
					source_id: if field.multi_language == true || skip_multi_language { content_id } else { translation_id },
					name: slug.clone(),
					sequence_number: None,
					content_component_id: None,
					data_type: populated_cc.content_component.data_type,
					value: None,
				};
				let mut fields = vec![parent_field.clone()];

				let mut sub_fields = Self::get_field_inserts(
					content_id,
					translation_id,
					parent_field.id,
					populated_cc.fields,
					values[slug.clone()].clone(),
					existing_content_fields,
					if skip_multi_language { true } else { field.multi_language }
				);
				fields.append(&mut sub_fields);

				fields
			}
		}
	}

	fn get_field_insert_by_index(
		content_id: Uuid,
		translation_id: Uuid,
		parent_id: Option<Uuid>,
		slug: usize,
		populated_cc: PopulatedContentComponent,
		values: Value,
		field: FieldModel,
		existing_content_fields: &Vec<ContentField>,
		skip_multi_language: bool,
	) -> Vec<CreateContentField> {
		match populated_cc.content_component.data_type {
			DataTypeEnum::TEXT
			| DataTypeEnum::NUMBER
			| DataTypeEnum::BOOLEAN
			| DataTypeEnum::REFERENCE => vec![CreateContentField {
				id: None,
				parent_id,
				source_id: if field.multi_language == true || skip_multi_language { content_id } else { translation_id },
				name: slug.clone().to_string(),
				sequence_number: None,
				content_component_id: Some(populated_cc.content_component.id),
				data_type: populated_cc.content_component.data_type,
				value: Some(values[slug.clone()].clone()),
			}],
			DataTypeEnum::ARRAY => todo!(),
			DataTypeEnum::OBJECT => {
				let existing_content_field = existing_content_fields
					.iter()
					.find(|content_field| content_field.parent_id == parent_id && content_field.name == slug.to_string());
				let uuid = if existing_content_field.is_some() { existing_content_field.unwrap().id.to_owned() } else { Uuid::new_v4() };

				let parent_field = CreateContentField {
					id: Some(uuid),
					parent_id,
					source_id: if field.multi_language == true || skip_multi_language { content_id } else { translation_id },
					name: slug.clone().to_string(),
					sequence_number: None,
					content_component_id: None,
					data_type: populated_cc.content_component.data_type,
					value: None,
				};
				let mut fields = vec![parent_field.clone()];

				let mut sub_fields = Self::get_field_inserts(
					content_id,
					translation_id,
					parent_field.id,
					populated_cc.fields,
					values[slug.clone()].clone(),
					existing_content_fields,
					if skip_multi_language { true } else { field.multi_language }
				);
				fields.append(&mut sub_fields);

				fields
			}
		}
	}

	pub fn get_field_inserts(
		content_id: Uuid,
		translation_id: Uuid,
		parent_id: Option<Uuid>,
		fields: Vec<PopulatedContentTypeField>,
		values: Value,
		existing_content_fields: &Vec<ContentField>,
		skip_multi_language: bool,
	) -> Vec<CreateContentField> {
		let values_to_insert: Vec<CreateContentField> = fields
			.into_iter()
			.map(|(field, populated_cc, _field_config)| {
				if field.min != 1 || field.max != 1 {
					let parent_field = CreateContentField {
						id: Some(Uuid::new_v4()),
						parent_id,
						source_id: if field.multi_language || skip_multi_language == true { content_id } else { translation_id },
						name: field.slug.clone(),
						sequence_number: None,
						content_component_id: Some(populated_cc.content_component.id),
						data_type: DataTypeEnum::ARRAY,
						value: None,
					};
					let mut fields = vec![parent_field.clone()];

					let sub_values = values[field.slug.clone()].as_array();

					if sub_values.is_none() {
						return fields;
					}

					let mut sub_fields = sub_values
						.unwrap()
						.into_iter()
						.enumerate()
						.map(|(i, _value)| {
							Self::get_field_insert_by_index(
								content_id,
								translation_id,
								parent_field.id,
								i,
								populated_cc.clone(),
								values[field.slug.clone()].clone(),
								field.clone(),
								existing_content_fields,
								if skip_multi_language { true } else { field.multi_language }
							)
						})
						.flatten()
						.collect();
					fields.append(&mut sub_fields);

					return fields;
				}

				Self::get_field_insert(
					content_id,
					translation_id,
					parent_id,
					field.slug.clone(),
					populated_cc,
					values.clone(),
					field.clone(),
					existing_content_fields,
					if skip_multi_language { true } else { field.multi_language }
				)
			})
			.flatten()
			.collect();

		values_to_insert
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = content)]
pub struct CreateContent {
	pub name: String,
	pub slug: String,
	pub workflow_state_id: Uuid,
	pub translation_id: Uuid,
	pub content_type_id: Uuid,
	pub language_id: Uuid,
	pub site_id: Uuid,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = content)]
pub struct UpdateContent {
	pub name: Option<String>,
	pub workflow_state_id: Uuid,
	pub updated_at: NaiveDateTime,
}
