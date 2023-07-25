use chrono::NaiveDateTime;
use diesel::prelude::*;
use itertools::{izip, Itertools};
use serde::Deserialize;
use uuid::Uuid;
use slug::slugify;

use crate::errors::AppError;
use crate::modules::content_types::models::field::{FieldModel, FieldTypeEnum};
use crate::modules::content_types::models::field_config::FieldConfig;
use crate::schema::{content_components, fields};

#[derive(Identifiable, Selectable, Queryable, Debug, Clone)]
#[diesel(table_name = content_components)]
#[diesel(primary_key(id))]
pub struct ContentComponent {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub component_name: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl ContentComponent {
	pub fn create(
		conn: &mut PgConnection,
		_site_id: Uuid,
		name: String,
		component_name: String,
	) -> Result<
		(
			ContentComponent,
			Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>,
			Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>,
		),
		AppError,
	> {
		let created_content_component = diesel::insert_into(content_components::table)
			.values(CreateContentComponent {
				slug: slugify(&name),
				name,
				component_name,
			})
			.returning(ContentComponent::as_returning())
			.get_result(conn)?;
		
		let content_components = Self::populate_fields(conn, vec![created_content_component])?;

		Ok(content_components.first().unwrap().clone())
	}

	pub fn find_one(
		conn: &mut PgConnection,
		_site_id: Option<Uuid>,
		id: Uuid,
	) -> Result<ContentComponent, AppError> {
		let content_component = content_components::table.find(id).first::<Self>(conn)?;

		Ok(content_component)
	}

	pub fn find(
		conn: &mut PgConnection,
		_site_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<
		(
			Vec<(
				ContentComponent,
				Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>,
				Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>,
			)>,
			i64,
		),
		AppError,
	> {
		if pagesize == -1 {
			let content_components = content_components::table
				.select(ContentComponent::as_select())
				.load::<ContentComponent>(conn)?;
			let populated_content_components = Self::populate_fields(conn, content_components)?;

			return Ok((populated_content_components.clone(), populated_content_components.len().try_into().unwrap()));
		}

		let content_components = content_components::table
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.select(ContentComponent::as_select())
			.load::<ContentComponent>(conn)?;
		let populated_content_components = Self::populate_fields(conn, content_components)?;
		let total_elements = content_components::table.count().get_result::<i64>(conn)?;

		Ok((populated_content_components, total_elements))
	}

	// pub fn update(
	// 	conn: &mut PgConnection,
	// 	role_id: Uuid,
	// 	changeset: UpdateRole,
	// 	policy_ids: Vec<Uuid>,
	// ) -> Result<(Self, Vec<IAMPolicy>), AppError> {
	// 	let target = roles::table.find(role_id);
	// 	let role = diesel::update(target)
	// 		.set(changeset)
	// 		.get_result::<Role>(conn)?;
	// 	RoleIAMPolicy::create_for_role(conn, role_id, policy_ids)?;
	// 	let policies = Self::find_policies(conn, &role)?;

	// 	Ok((role, policies))
	// }

	pub fn remove(conn: &mut PgConnection, content_component_id: Uuid) -> Result<(), AppError> {
		let target =
			content_components::table.filter(content_components::id.eq(content_component_id));
		diesel::delete(target).get_result::<ContentComponent>(conn)?;
		Ok(())
	}

	pub fn populate_fields(
		conn: &mut PgConnection,
		content_components: Vec<ContentComponent>,
	) -> Result<
		Vec<(
			ContentComponent,
			Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>,
			Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>,
		)>,
		AppError,
	> {
		let all_content_components = content_components::table
			.select(ContentComponent::as_select())
			.load::<ContentComponent>(conn)?;

		let configuration_fields = FieldModel::belonging_to(&content_components)
			.filter(fields::field_type.eq(FieldTypeEnum::ContentCompentConfigField))
			.select(FieldModel::as_select())
			.load::<FieldModel>(conn)?;

		let sub_fields = FieldModel::belonging_to(&content_components)
			.filter(fields::field_type.eq(FieldTypeEnum::ContentCompentSubField))
			.select(FieldModel::as_select())
			.load::<FieldModel>(conn)?;

		let configuration_fields_config = FieldConfig::belonging_to(&configuration_fields)
			.select(FieldConfig::as_select())
			.load::<FieldConfig>(conn)?;

		let sub_fields_config = FieldConfig::belonging_to(&sub_fields)
			.select(FieldConfig::as_select())
			.load::<FieldConfig>(conn)?;

		let configuration_fields_config_grouped: Vec<Vec<FieldConfig>> = configuration_fields_config.grouped_by(&configuration_fields);
		let configuration_fields_with_config: Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)> =
			configuration_fields
				.into_iter()
				.zip(configuration_fields_config_grouped)
				.map(|(field, field_configs)| {
					let content_component = all_content_components
						.iter()
						.find(|cp| cp.id == field.content_component_id)
						.map(|cp| cp.to_owned());
					(field, content_component.unwrap(), field_configs)
				})
				.collect();

		let sub_fields_config_grouped: Vec<Vec<FieldConfig>> = sub_fields_config.grouped_by(&sub_fields);
		let sub_fields_with_config: Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)> =
			sub_fields
				.into_iter()
				.zip(sub_fields_config_grouped)
				.map(|(field, field_configs)| {
					let content_component = content_components
						.iter()
						.find(|cp| cp.id == field.content_component_id)
						.map(|cp| cp.to_owned());
					(field, content_component.unwrap(), field_configs)
				})
				.collect();

		let grouped_configuration_fields = configuration_fields_with_config.grouped_by(&content_components);
		let grouped_sub_fields = sub_fields_with_config.grouped_by(&content_components);
		let populared_content_components = izip!(content_components, grouped_configuration_fields, grouped_sub_fields).collect_vec();

		Ok(populared_content_components)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = content_components)]
pub struct CreateContentComponent {
	name: String,
	slug: String,
	component_name: String,
}
