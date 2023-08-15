use std::collections::HashMap;

use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use slug::slugify;
use tracing::instrument;

use crate::errors::AppError;
use crate::modules::content_components::enums::data_type::DataTypeEnum;
use crate::modules::content_types::models::field::{FieldModel, FieldTypeEnum};
use crate::modules::content_types::models::field_config::{
	FieldConfig, FieldConfigTypeEnum, FieldConfigContent,
};
use crate::schema::{content_components, fields};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PopulatedContentComponent {
	pub content_component: ContentComponent,
	pub configuration_fields: Vec<(
		FieldModel,
		PopulatedContentComponent,
		HashMap<String, FieldConfigContent>,
	)>,
	pub fields: Vec<(
		FieldModel,
		PopulatedContentComponent,
		HashMap<String, FieldConfigContent>,
	)>,
}

#[derive(Identifiable, Selectable, Queryable, Debug, Clone, Serialize, Deserialize)]
#[diesel(table_name = content_components)]
#[diesel(primary_key(id))]
pub struct ContentComponent {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub description: Option<String>,
	pub data_type: DataTypeEnum,
	pub hidden: bool,
	pub internal: bool,
	pub deleted: bool,
	pub removeable: bool,
	pub component_name: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl ContentComponent {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		_site_id: Uuid,
		name: String,
		description: Option<String>,
		component_name: String,
	) -> Result<PopulatedContentComponent, AppError> {
		let created_content_component = diesel::insert_into(content_components::table)
			.values(CreateContentComponent {
				slug: slugify(&name),
				name,
				description,
				component_name,
				data_type: DataTypeEnum::OBJECT,
			})
			.returning(ContentComponent::as_returning())
			.get_result(conn)?;

		let content_components = Self::populate_fields(conn, vec![created_content_component])?;

		Ok(content_components.first().unwrap().clone())
	}

	#[instrument(skip(conn))]
	pub fn find_one(
		conn: &mut PgConnection,
		_site_id: Option<Uuid>,
		id: Uuid,
	) -> Result<ContentComponent, AppError> {
		let content_component = content_components::table.find(id).first::<Self>(conn)?;

		Ok(content_component)
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		_site_id: Uuid,
		page: i64,
		pagesize: i64,
		include_hidden: bool,
		include_internal: bool,
	) -> Result<(Vec<ContentComponent>, i64), AppError> {
		let query = {
			let mut query = content_components::table
				// .filter(not(content_components::hidden.eq(true)))
				.into_boxed();

			if include_hidden == false {
				query = query.filter(content_components::hidden.eq(false))
			};

			if include_internal == false {
				query = query.filter(content_components::internal.eq(false))
			};

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let content_components = query
			.select(ContentComponent::as_select())
			.load::<ContentComponent>(conn)?;
		// TODO: take filtering in consideration
		let total_elements = content_components::table.count().get_result::<i64>(conn)?;

		Ok((content_components, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		content_component_id: Uuid,
		changeset: UpdateContentComponent,
	) -> Result<PopulatedContentComponent, AppError> {
		let target = content_components::table.find(content_component_id);
		let updated_content_component = diesel::update(target)
			.set(changeset)
			.get_result::<ContentComponent>(conn)?;

		let content_components = Self::populate_fields(conn, vec![updated_content_component])?;

		Ok(content_components.first().unwrap().clone())
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_component_id: Uuid) -> Result<(), AppError> {
		let target =
			content_components::table.filter(content_components::id.eq(content_component_id));
		diesel::delete(target).get_result::<ContentComponent>(conn)?;
		Ok(())
	}

	#[instrument(skip(conn))]
	pub fn populate_config(
		conn: &mut PgConnection,
		field_configs: Vec<FieldConfig>,
	) -> Result<HashMap<String, FieldConfigContent>, AppError> {
		let populated_field_configs = field_configs
			.into_iter()
			.map(|field_config| {
				let content: FieldConfigContent = match field_config.config_type {
					FieldConfigTypeEnum::Text => {
						FieldConfigContent::Text(field_config.content.unwrap())
					}
					FieldConfigTypeEnum::Json => FieldConfigContent::Json(serde_json::from_str(
						&field_config.content.unwrap(),
					)?),
					FieldConfigTypeEnum::Fields => {
						let fields = fields::table
							.filter(fields::parent_id.eq(field_config.id))
							.select(FieldModel::as_select())
							.load::<FieldModel>(conn)?;

						let fields_with_config = FieldModel::populate_fields(conn, fields)?;

						FieldConfigContent::Fields(fields_with_config)
					}
				};

				Ok((field_config.config_key, content))
			})
			.collect::<Result<HashMap<String, FieldConfigContent>, AppError>>()?;

		Ok(populated_field_configs)
	}

	#[instrument(skip(conn))]
	pub fn populate_fields(
		conn: &mut PgConnection,
		content_components: Vec<ContentComponent>,
	) -> Result<Vec<PopulatedContentComponent>, AppError> {
		let all_content_components = content_components::table
			.select(ContentComponent::as_select())
			.load::<ContentComponent>(conn)?;

		let id_indices: Vec<Uuid> = content_components.iter().map(|cc| cc.id).collect();

		let configuration_fields = fields::table
			.filter(fields::field_type.eq(FieldTypeEnum::ContentCompentConfigField))
			.filter(fields::parent_id.eq_any(&id_indices))
			.select(FieldModel::as_select())
			.load::<FieldModel>(conn)?;

		let cc_fields = fields::table
			.filter(fields::field_type.eq(FieldTypeEnum::ContentCompentField))
			.filter(fields::parent_id.eq_any(id_indices))
			.select(FieldModel::as_select())
			.load::<FieldModel>(conn)?;

		let configuration_fields_config: Vec<FieldConfig> =
			FieldConfig::belonging_to(&configuration_fields)
				.select(FieldConfig::as_select())
				.load::<FieldConfig>(conn)?;

		let cc_fields_config: Vec<FieldConfig> = FieldConfig::belonging_to(&cc_fields)
			.select(FieldConfig::as_select())
			.load::<FieldConfig>(conn)?;

		let configuration_fields_config_grouped: Vec<Vec<FieldConfig>> =
			configuration_fields_config.grouped_by(&configuration_fields);
		let configuration_fields_with_config: Vec<(
			FieldModel,
			ContentComponent,
			HashMap<String, FieldConfigContent>,
		)> = configuration_fields
			.into_iter()
			.zip(configuration_fields_config_grouped)
			.map(|(field, field_configs)| {
				let populated_field_configs = Self::populate_config(conn, field_configs)?;

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

		let cc_fields_config_grouped: Vec<Vec<FieldConfig>> =
			cc_fields_config.grouped_by(&cc_fields);
		let cc_fields_with_config: Vec<(
			FieldModel,
			ContentComponent,
			HashMap<String, FieldConfigContent>,
		)> = cc_fields
			.into_iter()
			.zip(cc_fields_config_grouped)
			.map(|(field, field_configs)| {
				let populated_field_configs = Self::populate_config(conn, field_configs)?;

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

		let populated_content_components = content_components
			.into_iter()
			.map(|content_component| {
				let configuration_fields = configuration_fields_with_config
					.clone()
					.into_iter()
					.filter(|(field, _cc, _field_config)| field.parent_id == content_component.id)
					.map(|(field, cc, field_config)| {
						Ok((
							field,
							PopulatedContentComponent {
								content_component: cc,
								configuration_fields: vec![],
								fields: vec![],
							},
							field_config,
						))
					})
					.collect::<Result<Vec<_>, AppError>>()?;

				let fields = cc_fields_with_config
					.clone()
					.into_iter()
					.filter(|(field, _cc, _field_config)| field.parent_id == content_component.id)
					.map(|(field, cc, field_config)| {
						let populated_content_components = Self::populate_fields(conn, vec![cc])?;

						Ok((
							field,
							populated_content_components.first().unwrap().clone(),
							field_config,
						))
					})
					.collect::<Result<Vec<_>, AppError>>()?;

				Ok(PopulatedContentComponent {
					content_component,
					configuration_fields,
					fields,
				})
			})
			.collect::<Result<Vec<PopulatedContentComponent>, AppError>>()?;

		Ok(populated_content_components)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = content_components)]
pub struct CreateContentComponent {
	name: String,
	slug: String,
	description: Option<String>,
	data_type: DataTypeEnum,
	component_name: String,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = content_components)]
pub struct UpdateContentComponent {
	pub name: Option<String>,
	pub description: Option<String>,
}
