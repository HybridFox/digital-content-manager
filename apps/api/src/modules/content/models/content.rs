use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;
use tracing::instrument;

use crate::errors::AppError;
use crate::schema::content;

#[derive(Identifiable, Selectable, Queryable, Debug, Clone)]
#[diesel(table_name = content)]
#[diesel(primary_key(id))]
pub struct Content {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub workflow_state_id: Uuid,
	pub translation_id: Uuid,
	pub site_id: Uuid,
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
		values: CreateContent,
	) -> Result<Self, AppError> {
		let content_type = diesel::insert_into(content::table)
			.values(values)
			.returning(Content::as_returning())
			.get_result(conn)?;

		// SiteContentType::create(conn, site_id, content_type.id)?;

		Ok(content_type)
	}

	#[instrument(skip(conn))]
	pub fn find_one(conn: &mut PgConnection, _site_id: Uuid, id: Uuid) -> Result<Self, AppError> {
		let content = content::table.find(id).first::<Self>(conn)?;
		// let fields_with_config = Self::find_fields(conn, &vec![content.clone()])?;

		Ok(content)
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let query = {
			let mut query = content::table
				.filter(content::site_id.eq(site_id))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let content = query.select(Content::as_select()).load::<Content>(conn)?;

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
		id: Uuid,
		changeset: UpdateContent,
	) -> Result<Self, AppError> {
		let target = content::table.find(id);
		diesel::update(target)
			.set(changeset)
			.get_result::<Self>(conn)?;

		let content = Self::find_one(conn, site_id, id)?;

		Ok(content)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_id: Uuid) -> Result<(), AppError> {
		diesel::delete(content::table.filter(content::id.eq(content_id)))
			.get_result::<Content>(conn)?;

		Ok(())
	}

	// #[instrument(skip(conn))]
	// pub fn find_fields(
	// 	conn: &mut PgConnection,
	// 	content_types: &Vec<ContentType>,
	// ) -> Result<
	// 	Vec<(
	// 		FieldModel,
	// 		ContentComponent,
	// 		HashMap<String, FieldConfigContent>,
	// 	)>,
	// 	AppError,
	// > {
	// 	let all_content_components = content_components::table
	// 		.select(ContentComponent::as_select())
	// 		.load::<ContentComponent>(conn)?;

	// 	let fields = FieldModel::belonging_to(content_types)
	// 		.select(FieldModel::as_select())
	// 		.load::<FieldModel>(conn)?;

	// 	let field_config = FieldConfig::belonging_to(&fields)
	// 		.select(FieldConfig::as_select())
	// 		.load::<FieldConfig>(conn)?;

	// 	let grouped_config: Vec<Vec<FieldConfig>> = field_config.grouped_by(&fields);
	// 	let fields_with_config = fields
	// 		.into_iter()
	// 		.zip(grouped_config)
	// 		.map(|(field, field_configs)| {
	// 			let populated_field_configs =
	// 				ContentComponent::populate_config(conn, field_configs)?;
	// 			let content_component = all_content_components
	// 				.iter()
	// 				.find(|cp| cp.id == field.content_component_id)
	// 				.map(|cp| cp.to_owned());

	// 			Ok((field, content_component.unwrap(), populated_field_configs))
	// 		})
	// 		.collect::<Result<
	// 			Vec<(
	// 				FieldModel,
	// 				ContentComponent,
	// 				HashMap<String, FieldConfigContent>,
	// 			)>,
	// 			AppError,
	// 		>>()?;

	// 	Ok(fields_with_config)
	// }
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = content)]
pub struct CreateContent {
	pub name: String,
	pub slug: String,
	pub workflow_state_id: Uuid,
	pub translation_id: Uuid,
	pub site_id: Uuid,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = content)]
pub struct UpdateContent {
	pub name: Option<String>,
	pub workflow_state_id: Uuid,
}
