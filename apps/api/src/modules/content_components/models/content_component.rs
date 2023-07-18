use chrono::NaiveDateTime;
use diesel::prelude::*;
use reqwest::StatusCode;
use serde::Deserialize;
use uuid::Uuid;
use slug::slugify;

use crate::errors::{AppError, AppErrorValue};
use crate::modules::content_types::models::field::FieldModel;
use crate::modules::content_types::models::field_config::FieldConfig;
use crate::schema::content_components;

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
	) -> Result<(ContentComponent, Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>), AppError> {
		let content_component = diesel::insert_into(content_components::table)
			.values(CreateContentComponent {
				slug: slugify(&name),
				name,
				component_name,
			})
			.returning(ContentComponent::as_returning())
			.get_result(conn)?;
		let content_components = content_components::table
			.select(ContentComponent::as_select())
			.load::<ContentComponent>(conn)?;

		let fields = FieldModel::belonging_to(&content_component)
			.select(FieldModel::as_select())
			.load::<FieldModel>(conn)?;

		let field_config = FieldConfig::belonging_to(&fields)
			.select(FieldConfig::as_select())
			.load::<FieldConfig>(conn)?;

		let grouped_config: Vec<Vec<FieldConfig>> = field_config.grouped_by(&fields);
		let fields_with_config: Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)> = fields
			.into_iter()
			.zip(grouped_config)
			.map(|(field, field_configs)| {
				let content_component = content_components.iter().find(|cp| cp.id == field.content_component_id).map(|cp| cp.to_owned());
				(field, content_component.unwrap(), field_configs)
			})
			.collect();

		Ok((content_component, fields_with_config))
	}
	
	pub fn find_one(conn: &mut PgConnection, _site_id: Uuid, id: Uuid) -> Result<(ContentComponent, Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>), AppError> {
		let content_component = content_components::table.find(id).first::<Self>(conn)?;
		let content_components = content_components::table
			.select(ContentComponent::as_select())
			.load::<ContentComponent>(conn)?;

		let fields = FieldModel::belonging_to(&content_component)
			.select(FieldModel::as_select())
			.load::<FieldModel>(conn)?;

		let field_config = FieldConfig::belonging_to(&fields)
			.select(FieldConfig::as_select())
			.load::<FieldConfig>(conn)?;

		let grouped_config: Vec<Vec<FieldConfig>> = field_config.grouped_by(&fields);
		let fields_with_config: Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)> = fields
			.into_iter()
			.zip(grouped_config)
			.map(|(field, field_configs)| {
				let content_component = content_components.iter().find(|cp| cp.id == field.content_component_id).map(|cp| cp.to_owned());
				(field, content_component.unwrap(), field_configs)
			})
			.collect();

		Ok((content_component, fields_with_config))
	}

	pub fn find(
		conn: &mut PgConnection,
		_site_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<(ContentComponent, Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>)>, i64), AppError> {
		// if pagesize == -1 {
			let content_components = content_components::table
				.select(ContentComponent::as_select())
				.load::<ContentComponent>(conn)?;

			let fields = FieldModel::belonging_to(&content_components)
				.select(FieldModel::as_select())
				.load::<FieldModel>(conn)?;

			let field_config = FieldConfig::belonging_to(&fields)
				.select(FieldConfig::as_select())
				.load::<FieldConfig>(conn)?;

			let grouped_config: Vec<Vec<FieldConfig>> = field_config.grouped_by(&fields);
			let fields_with_config: Vec<Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>> = fields
				.into_iter()
				.zip(grouped_config)
				.map(|(field, field_configs)| {
					let content_component = content_components.iter().find(|cp| cp.id == field.content_component_id).map(|cp| cp.to_owned());
					(field, content_component.unwrap(), field_configs)
				})
				.grouped_by(&content_components);
			let result: Vec<(ContentComponent, Vec<(FieldModel, ContentComponent, Vec<FieldConfig>)>)> = content_components
				.into_iter()
				.zip(fields_with_config)
				.collect();

			Ok((result.clone(), result.len().try_into().unwrap()))
		// }

		// let content_components = content_components::table
		// 	.offset((page - 1) * pagesize)
		// 	.limit(pagesize)
		// 	.select(ContentComponent::as_select())
		// 	.load::<ContentComponent>(conn)?;


		// let total_elements = content_components::table.count().get_result::<i64>(conn)?;

		// Ok((content_components, total_elements))
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
		let target = content_components::table.filter(content_components::id.eq(content_component_id));
		diesel::delete(target).get_result::<ContentComponent>(conn)?;
		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = content_components)]
pub struct CreateContentComponent {
	name: String,
	slug: String,
	component_name: String,
}
