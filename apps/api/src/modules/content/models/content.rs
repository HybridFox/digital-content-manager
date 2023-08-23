use chrono::NaiveDateTime;
use diesel::dsl::*;
use diesel::prelude::*;
use serde::Deserialize;
use serde_json::Value;
use uuid::Uuid;
use tracing::instrument;

use crate::errors::AppError;
use crate::modules::content::helpers::upsert_fields::upsert_fields;
use crate::modules::content_types::models::content_type::{ContentType, ContentTypeKindEnum};
use crate::modules::languages::models::language::Language;
use crate::modules::workflows::models::workflow_state::WorkflowState;
use crate::schema::{content, content_fields, languages, content_types, workflow_states};

use super::content_field::ContentField;

#[derive(Identifiable, Selectable, Queryable, Debug, Associations, Clone)]
#[diesel(table_name = content)]
#[diesel(belongs_to(ContentType))]
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
	) -> Result<(Self, Vec<ContentField>, Language, WorkflowState), AppError> {
		let content_item = diesel::insert_into(content::table)
			.values(&content_item)
			.returning(Content::as_returning())
			.get_result(conn)?;

		let (_content_type, fields) =
			ContentType::find_one(conn, site_id, content_item.content_type_id)?;
		upsert_fields(
			conn,
			content_item.id,
			content_item.translation_id,
			fields,
			values,
			&vec![],
		)?;

		let fields = content_fields::table
			.filter(
				content_fields::source_id
					.eq_any(vec![content_item.id, content_item.translation_id]),
			)
			.select(ContentField::as_select())
			.load::<ContentField>(conn)?;
		let language = languages::table
			.find(content_item.language_id)
			.first(conn)?;
		let workflow_state = workflow_states::table
			.find(content_item.workflow_state_id)
			.first(conn)?;

		Ok((content_item, fields, language, workflow_state))
	}

	#[instrument(skip(conn))]
	pub fn find_one(
		conn: &mut PgConnection,
		site_id: Uuid,
		id: Uuid,
	) -> Result<(Self, Vec<ContentField>, Language, WorkflowState), AppError> {
		let content_item = content::table
			.filter(content::site_id.eq(site_id))
			.find(id)
			.first::<Self>(conn)?;

		let fields = content_fields::table
			.filter(
				content_fields::source_id
					.eq_any(vec![content_item.id, content_item.translation_id]),
			)
			.select(ContentField::as_select())
			.load::<ContentField>(conn)?;

		let language = languages::table
			.find(content_item.language_id)
			.first(conn)?;
		let workflow_state = workflow_states::table
			.find(content_item.workflow_state_id)
			.first(conn)?;

		Ok((content_item, fields, language, workflow_state))
	}

	#[instrument(skip(conn))]
	pub fn find_one_public<'a>(
		conn: &mut PgConnection,
		site_id: Uuid,
		slug: Option<String>,
		content_item_id: Option<Uuid>,
		populate: Option<bool>,
		lang: &'a str,
	) -> Result<(Self, Vec<ContentField>, Language, Vec<(Self, Language)>), AppError> {
		let query = {
			let mut query = content::table
				.filter(content::published.eq(true))
				.inner_join(languages::table.on(languages::id.eq(content::language_id)))
				.filter(languages::key.eq(lang))
				.into_boxed();

			if let Some(slug) = slug {
				query = query.filter(content::slug.eq(slug))
			}

			if let Some(content_item_id) = content_item_id {
				query = query.filter(content::id.eq(content_item_id))
			}

			// if let Some(populate) = populate {
			// 	query = query.filter(content::id.eq(content_item_id))
			// }

			query
		};

		let (content_item, language) = query.get_result::<(Self, Language)>(conn)?;
		let fields = match populate {
			Some(true) => {
				let query = sql_query(
					"
					WITH RECURSIVE cte_fields AS (
						SELECT
							a.id,
							a.name,
							a.value,
							a.parent_id,
							a.source_id,
							a.content_component_id,
							a.sequence_number,
							a.data_type
						FROM
							content_fields a
							WHERE
								a.source_id = ANY ($1)
						UNION ALL
						SELECT
							b.id,
							b.name,
							b.value,
							b.parent_id,
							b.source_id,
							b.content_component_id,
							b.sequence_number,
							b.data_type
						FROM
							content_fields b
							INNER JOIN cte_fields f ON b.source_id::text = ANY( ARRAY [f.value->>'contentId', f.value->>'translationId'])
					)
					SELECT
						*
					FROM
						cte_fields",
				);
				query
					.bind::<diesel::sql_types::Array<diesel::sql_types::Uuid>, _>(vec![content_item.id, content_item.translation_id])
					.get_results::<ContentField>(conn)?
			},
			Some(false) |
			None => {
				content_fields::table
					.filter(
						content_fields::source_id
							.eq_any(vec![content_item.id, content_item.translation_id]),
					)
					.select(ContentField::as_select())
					.load::<ContentField>(conn)?
			}
		};

		let translations = content::table
			.filter(content::translation_id.eq(&content_item.translation_id))
			.filter(content::published.eq(true))
			.inner_join(languages::table.on(languages::id.eq(content::language_id)))
			.get_results::<(Self, Language)>(conn)?;

		Ok((content_item, fields, language, translations))
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
		translation_id: Option<Uuid>,
		content_types: Option<Vec<Uuid>>,
	) -> Result<(Vec<(Self, Language, ContentType, WorkflowState)>, i64), AppError> {
		let query = {
			let mut query = content::table
				.filter(content::site_id.eq(site_id))
				.inner_join(languages::table.on(languages::id.eq(content::language_id)))
				.inner_join(content_types::table.on(content_types::id.eq(content::content_type_id)))
				.inner_join(
					workflow_states::table.on(workflow_states::id.eq(content::workflow_state_id)),
				)
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			if let Some(kind) = kind {
				query = query.filter(content_types::kind.eq(kind));
			}

			if let Some(content_types) = content_types {
				query = query.filter(content_types::id.eq_any(content_types));
			}

			if let Some(translation_id) = translation_id {
				query = query.filter(content::translation_id.eq(translation_id));
			}

			if let Some(language_id) = language_id {
				query = query.filter(content::language_id.eq(language_id));
			}

			query
		};

		let total_query = {
			let mut query = content::table
				.filter(content::site_id.eq(site_id))
				.inner_join(content_types::table.on(content_types::id.eq(content::content_type_id)))
				.into_boxed();

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
			.select((
				Content::as_select(),
				Language::as_select(),
				ContentType::as_select(),
				WorkflowState::as_select(),
			))
			.load::<(Content, Language, ContentType, WorkflowState)>(conn)?;

		let total_elements = total_query.count().get_result::<i64>(conn)?;

		Ok((content, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_type_id: Uuid,
		id: Uuid,
		changeset: UpdateContent,
		values: Value,
	) -> Result<(Self, Vec<ContentField>, Language, WorkflowState), AppError> {
		let target = content::table.find(id);
		let updated_content_item = diesel::update(target)
			.set(changeset)
			.returning(Content::as_returning())
			.get_result::<Self>(conn)?;

		let (_content_type, fields) = ContentType::find_one(conn, site_id, content_type_id)?;
		let content_fields = content_fields::table
			.filter(content_fields::source_id.eq_any(vec![id, updated_content_item.translation_id]))
			.select(ContentField::as_select())
			.load::<ContentField>(conn)?;
		upsert_fields(
			conn,
			id,
			updated_content_item.translation_id,
			fields,
			values,
			&content_fields,
		)?;

		let content_item = Self::find_one(conn, site_id, id)?;

		Ok(content_item)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_id: Uuid) -> Result<(), AppError> {
		diesel::delete(content::table.filter(content::id.eq(content_id)))
			.get_result::<Content>(conn)?;

		Ok(())
	}

	#[instrument(skip(conn))]
	pub fn slug_in_use<'a>(
		conn: &mut PgConnection,
		site_id: Uuid,
		translation_id: Option<Uuid>,
		slug: &'a str,
	) -> Result<bool, AppError> {
		let query = {
			let mut query = content::table
				.filter(content::site_id.eq(site_id))
				.filter(content::slug.eq(slug))
				.into_boxed();

			if let Some(translation_id) = translation_id {
				query = query.filter(not(content::translation_id.eq(translation_id)));
			}

			query
		};

		let content_count = query.count().get_result::<i64>(conn)?;

		Ok(content_count > 0)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = content)]
pub struct CreateContent<'a> {
	pub name: &'a str,
	pub slug: &'a str,
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
	pub slug: Option<String>,
	pub published: bool,
	pub workflow_state_id: Uuid,
	pub updated_at: NaiveDateTime,
}
