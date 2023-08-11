use diesel::PgConnection;
use serde_json::Value;
use diesel::prelude::*;
use uuid::Uuid;

use crate::errors::AppError;
use crate::modules::content::models::content_field::{CreateContentField, ContentField};
use crate::modules::content_components::enums::data_type::DataTypeEnum;
use crate::modules::content_components::models::content_component::PopulatedContentComponent;
use crate::modules::content_types::models::content_type::PopulatedContentTypeField;
use crate::modules::content_types::models::field::FieldModel;
use crate::schema::content_fields;

pub fn upsert_fields(
	conn: &mut PgConnection,
	content_id: Uuid,
	translation_id: Uuid,
	fields: Vec<PopulatedContentTypeField>,
	values: Value,
	existing_content_fields: &Vec<ContentField>,
) -> Result<(), AppError> {
	let target = content_fields::table
		.filter(content_fields::source_id.eq_any(vec![content_id, translation_id]));
	diesel::delete(target).execute(conn)?;

	let values_to_insert = get_field_inserts(
		content_id,
		translation_id,
		None,
		fields,
		values,
		existing_content_fields,
		false,
	);

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
			source_id: if field.multi_language == true || skip_multi_language {
				content_id
			} else {
				translation_id
			},
			name: slug.clone(),
			sequence_number: None,
			content_component_id: Some(populated_cc.content_component.id),
			data_type: populated_cc.content_component.data_type,
			value: Some(values[slug.clone()].clone()),
		}],
		DataTypeEnum::ARRAY => todo!(),
		DataTypeEnum::OBJECT => {
			let existing_content_field = existing_content_fields.iter().find(|content_field| {
				content_field.parent_id == parent_id && content_field.name == slug
			});
			let uuid = if existing_content_field.is_some() {
				existing_content_field.unwrap().id.to_owned()
			} else {
				Uuid::new_v4()
			};

			let parent_field = CreateContentField {
				id: Some(uuid),
				parent_id,
				source_id: if field.multi_language == true || skip_multi_language {
					content_id
				} else {
					translation_id
				},
				name: slug.clone(),
				sequence_number: None,
				content_component_id: None,
				data_type: populated_cc.content_component.data_type,
				value: None,
			};
			let mut fields = vec![parent_field.clone()];

			let mut sub_fields = get_field_inserts(
				content_id,
				translation_id,
				parent_field.id,
				populated_cc.fields,
				values[slug.clone()].clone(),
				existing_content_fields,
				if skip_multi_language {
					true
				} else {
					field.multi_language
				},
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
			source_id: if field.multi_language == true || skip_multi_language {
				content_id
			} else {
				translation_id
			},
			name: slug.clone().to_string(),
			sequence_number: None,
			content_component_id: Some(populated_cc.content_component.id),
			data_type: populated_cc.content_component.data_type,
			value: Some(values[slug.clone()].clone()),
		}],
		DataTypeEnum::ARRAY => todo!(),
		DataTypeEnum::OBJECT => {
			let existing_content_field = existing_content_fields.iter().find(|content_field| {
				content_field.parent_id == parent_id && content_field.name == slug.to_string()
			});
			let uuid = if existing_content_field.is_some() {
				existing_content_field.unwrap().id.to_owned()
			} else {
				Uuid::new_v4()
			};

			let parent_field = CreateContentField {
				id: Some(uuid),
				parent_id,
				source_id: if field.multi_language == true || skip_multi_language {
					content_id
				} else {
					translation_id
				},
				name: slug.clone().to_string(),
				sequence_number: None,
				content_component_id: None,
				data_type: populated_cc.content_component.data_type,
				value: None,
			};
			let mut fields = vec![parent_field.clone()];

			let mut sub_fields = get_field_inserts(
				content_id,
				translation_id,
				parent_field.id,
				populated_cc.fields,
				values[slug.clone()].clone(),
				existing_content_fields,
				if skip_multi_language {
					true
				} else {
					field.multi_language
				},
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
					source_id: if field.multi_language || skip_multi_language == true {
						content_id
					} else {
						translation_id
					},
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
						get_field_insert_by_index(
							content_id,
							translation_id,
							parent_field.id,
							i,
							populated_cc.clone(),
							values[field.slug.clone()].clone(),
							field.clone(),
							existing_content_fields,
							if skip_multi_language {
								true
							} else {
								field.multi_language
							},
						)
					})
					.flatten()
					.collect();
				fields.append(&mut sub_fields);

				return fields;
			}

			get_field_insert(
				content_id,
				translation_id,
				parent_id,
				field.slug.clone(),
				populated_cc,
				values.clone(),
				field.clone(),
				existing_content_fields,
				if skip_multi_language {
					true
				} else {
					field.multi_language
				},
			)
		})
		.flatten()
		.collect();

	values_to_insert
}
