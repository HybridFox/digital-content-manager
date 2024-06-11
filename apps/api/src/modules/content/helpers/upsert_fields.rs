use diesel::prelude::*;
use diesel::PgConnection;
use serde_json::Value;
use uuid::Uuid;

use crate::errors::AppError;
use crate::modules::content::models::content_field::{ContentField, CreateContentField};
use crate::modules::content_components::enums::data_type::DataTypeEnum;
use crate::modules::content_components::models::content_component::PopulatedContentComponent;
use crate::modules::content_types::models::content_type::{
	PopulatedBlockField, PopulatedContentTypeField,
};
use crate::modules::content_types::models::field::FieldModel;
use crate::schema::content_fields;

pub enum FieldIndex {
	Block(usize),
	Number(usize),
	String(String),
}

pub fn upsert_fields(
	conn: &mut PgConnection,
	revision_id: Uuid,
	translation_id: Uuid,
	fields: Vec<PopulatedContentTypeField>,
	values: Value,
	existing_content_fields: &Vec<ContentField>,
) -> Result<(), AppError> {
	let target = content_fields::table
		.filter(content_fields::source_id.eq_any(vec![revision_id, translation_id]));
	diesel::delete(target).execute(conn)?;

	let values_to_insert = get_field_inserts(
		revision_id,
		translation_id,
		None,
		fields,
		values,
		existing_content_fields,
		false,
	);

	diesel::insert_into(content_fields::table)
		.values(values_to_insert)
		.execute(conn)?;

	Ok(())
}

// Parent ID => The parent id is either null (root) or the parent_id
// Source ID => Either the translation ID or the OG content item
fn get_field_insert(
	revision_id: Uuid,
	translation_id: Uuid,
	parent_id: Option<Uuid>,
	index: FieldIndex,
	populated_cc: PopulatedContentComponent,
	values: Value,
	field: FieldModel,
	existing_content_fields: &Vec<ContentField>,
	skip_multi_language: bool,
	blocks: Vec<PopulatedBlockField>,
	sequence_number: Option<i32>,
) -> Vec<CreateContentField> {
	let index_key = match &index {
		FieldIndex::Block(number) => number.to_string(),
		FieldIndex::Number(number) => number.to_string(),
		FieldIndex::String(string) => string.clone(),
	};

	let value = match index {
		FieldIndex::Block(number) => values[number]["fields"].clone(),
		FieldIndex::Number(number) => values[number].clone(),
		FieldIndex::String(string) => values[string.clone()].clone(),
	};

	match populated_cc.content_component.data_type {
		DataTypeEnum::TEXT
		| DataTypeEnum::NUMBER
		| DataTypeEnum::BOOLEAN
		| DataTypeEnum::REFERENCE => vec![CreateContentField {
			id: None,
			parent_id,
			source_id: revision_id,
			name: index_key.clone(),
			sequence_number,
			content_component_id: Some(populated_cc.content_component.id),
			data_type: populated_cc.content_component.data_type,
			value: Some(value),
		}],
		DataTypeEnum::ARRAY => todo!(),
		DataTypeEnum::OBJECT => {
			let uuid = Uuid::new_v4();

			let parent_field = CreateContentField {
				id: Some(uuid),
				parent_id,
				source_id: revision_id,
				name: index_key.clone(),
				sequence_number,
				content_component_id: None,
				data_type: populated_cc.content_component.data_type,
				value: None,
			};
			let mut fields = vec![parent_field.clone()];

			let mut sub_fields = get_field_inserts(
				revision_id,
				translation_id,
				parent_field.id,
				populated_cc.fields,
				value,
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
		DataTypeEnum::BLOCK => {
			// One block
			let uuid = Uuid::new_v4();

			// parent field here, this only says that we deal with a ARRAY field
			let parent_field = CreateContentField {
				id: Some(uuid),
				parent_id,
				source_id: revision_id,
				name: index_key.clone(),
				sequence_number,
				content_component_id: None,
				data_type: DataTypeEnum::ARRAY,
				value: None,
			};
			let mut fields = vec![parent_field.clone()];

			// then for each entry in the block section, we save a parent item with BLOCK type and let the recursive code handle the rest
			let sub_values = values[field.slug.clone()].as_array();
			if sub_values.is_none() {
				return fields;
			}

			let mut sub_fields = sub_values
				.unwrap()
				.into_iter()
				.enumerate()
				.map(|(i, value)| {
					let sub_parent_field = CreateContentField {
						id: Some(Uuid::new_v4()),
						parent_id: parent_field.id,
						source_id: revision_id,
						name: i.clone().to_string(),
						sequence_number: Some(i as i32),
						content_component_id: None,
						data_type: DataTypeEnum::BLOCK,
						value: Some(value["block"].clone()), // block name hero
					};

					// Find the cc
					let block = blocks
						.clone()
						.into_iter()
						.find(|block| block.0.slug == value["block"]);
					let mut fields = vec![sub_parent_field.clone()];

					if block.is_none() {
						return fields;
					}

					let mut sub_fields = get_field_insert(
						revision_id,
						translation_id,
						sub_parent_field.id,
						FieldIndex::String(block.clone().unwrap().0.slug.clone()),
						block.unwrap().1.clone(),
						value["fields"].clone(),
						field.clone(),
						existing_content_fields,
						field.multi_language,
						vec![],
						None,
					);

					fields.append(&mut sub_fields);
					fields
				})
				.flatten()
				.collect();

			fields.append(&mut sub_fields);
			fields
		}
	}
}

pub fn get_field_inserts(
	revision_id: Uuid,
	translation_id: Uuid,
	parent_id: Option<Uuid>,
	fields: Vec<PopulatedContentTypeField>,
	values: Value,
	existing_content_fields: &Vec<ContentField>,
	skip_multi_language: bool,
) -> Vec<CreateContentField> {
	let values_to_insert: Vec<CreateContentField> = fields
		.into_iter()
		.map(|(field, populated_cc, _field_config, blocks)| {
			if (field.min != 1 || field.max != 1)
				&& populated_cc.content_component.data_type != DataTypeEnum::BLOCK
			{
				// Multifield
				let parent_field = CreateContentField {
					id: Some(Uuid::new_v4()),
					parent_id,
					source_id: revision_id, // always revision_id, we will handle multiLanguage syncing seperatly
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
						get_field_insert(
							revision_id,
							translation_id,
							parent_field.id,
							FieldIndex::Number(i),
							populated_cc.clone(),
							values[field.slug.clone()].clone(),
							field.clone(),
							existing_content_fields,
							field.multi_language,
							vec![],
							Some(i as i32),
						)
					})
					.flatten()
					.collect();
				fields.append(&mut sub_fields);

				return fields;
			}

			get_field_insert(
				revision_id,
				translation_id,
				parent_id,
				FieldIndex::String(field.slug.clone()),
				populated_cc,
				values.clone(),
				field.clone(),
				existing_content_fields,
				field.multi_language,
				blocks,
				None,
			)
		})
		.flatten()
		.collect::<Vec<CreateContentField>>();

	values_to_insert
}
