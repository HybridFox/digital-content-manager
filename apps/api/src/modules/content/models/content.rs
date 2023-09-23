use chrono::NaiveDateTime;
use diesel::dsl::*;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;
use tracing::instrument;

use crate::errors::AppError;
use crate::modules::content_types::models::content_type::{ContentType, ContentTypeKindEnum};
use crate::modules::languages::models::language::Language;
use crate::modules::workflows::models::workflow_state::WorkflowState;
use crate::schema::content_revisions;
use crate::schema::{content, content_fields, languages, content_types, workflow_states};

use super::content_field::ContentField;
use super::content_revision::ContentRevision;

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
	pub fn find_one(
		conn: &mut PgConnection,
		site_id: Uuid,
		id: Uuid,
	) -> Result<
		(
			Self,
			ContentRevision,
			Vec<ContentField>,
			Language,
			WorkflowState,
		),
		AppError,
	> {
		let content_item = content::table
			.filter(content::site_id.eq(site_id))
			.find(id)
			.first::<Self>(conn)?;

		let revision = content_revisions::table
			.filter(content_revisions::site_id.eq(site_id))
			.filter(content_revisions::content_id.eq(id))
			.order(content_revisions::created_at.desc())
			.first::<ContentRevision>(conn)?;

		dbg!(&revision);

		let fields = content_fields::table
			.filter(
				content_fields::source_id
					.eq_any(vec![revision.id, revision.revision_translation_id]),
			)
			.select(ContentField::as_select())
			.load::<ContentField>(conn)?;

		let language = languages::table
			.find(content_item.language_id)
			.first(conn)?;
		let workflow_state = workflow_states::table
			.find(revision.workflow_state_id)
			.first(conn)?;

		Ok((content_item, revision, fields, language, workflow_state))
	}

	fn find_field_content(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_item: &Self,
		populate: &Option<bool>,
	) -> Result<(ContentRevision, Vec<ContentField>, Vec<(Self, Language)>), AppError> {
		let revision: ContentRevision = content_revisions::table
			.filter(content_revisions::site_id.eq(site_id))
			.filter(content_revisions::content_id.eq(content_item.id))
			.filter(content_revisions::published.eq(true))
			.order(content_revisions::created_at.desc())
			.first::<ContentRevision>(conn)?;

		let translations = content::table
			.filter(content::translation_id.eq(content_item.translation_id))
			.filter(content::published.eq(true))
			.inner_join(languages::table.on(languages::id.eq(content::language_id)))
			.get_results::<(Self, Language)>(conn)?;

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
							CAST(f.value->>'contentId' as UUID),
							b.content_component_id,
							b.sequence_number,
							b.data_type
						FROM
							cte_fields f
						INNER JOIN LATERAL (
							SELECT cr.*
							FROM content_revisions cr 
							WHERE cr.published = true AND cr.content_id::text = f.value->>'contentId'
							ORDER BY cr.created_at DESC
							LIMIT 1
						) AS cr ON cr.content_id::text = f.value->>'contentId'
						INNER JOIN content_fields b ON b.source_id = ANY( ARRAY [cr.id, cr.revision_translation_id])
					)
					SELECT
						*
					FROM
						cte_fields",
				);
				query
					.bind::<diesel::sql_types::Array<diesel::sql_types::Uuid>, _>(vec![
						revision.id,
						revision.revision_translation_id,
					])
					.get_results::<ContentField>(conn)?
			}
			Some(false) | None => content_fields::table
				.filter(
					content_fields::source_id
						.eq_any(vec![revision.id, revision.revision_translation_id]),
				)
				.select(ContentField::as_select())
				.load::<ContentField>(conn)?,
		};

		Ok((revision, fields, translations))
	}

	#[instrument(skip(conn))]
	pub fn find_one_public<'a>(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_id: String,
		populate: Option<bool>,
		lang: &'a str,
	) -> Result<
		(
			Self,
			ContentRevision,
			Vec<ContentField>,
			Language,
			Vec<(Self, Language)>,
		),
		AppError,
	> {
		let query = content::table
			.filter(
				content::published.eq(true).and(
					content::slug
						.eq(content_id.clone())
						.or(content::id.eq(Uuid::parse_str(&content_id).unwrap_or(Uuid::new_v4()))),
				),
			)
			.inner_join(languages::table.on(languages::id.eq(content::language_id)))
			.filter(languages::key.eq(lang))
			.into_boxed();

		let (content_item, language) = query.get_result::<(Self, Language)>(conn)?;
		let (revision, fields, translations) =
			Self::find_field_content(conn, site_id, &content_item, &populate)?;

		Ok((content_item, revision, fields, language, translations))
	}

	#[instrument(skip(conn))]
	pub fn find_public<'a>(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
		lang: &'a str,
		content_types: &Option<Vec<Uuid>>,
		populate: &Option<bool>,
	) -> Result<
		(
			Vec<(
				Self,
				ContentRevision,
				Vec<ContentField>,
				Language,
				Vec<(Self, Language)>,
			)>,
			i64,
		),
		AppError,
	> {
		let query = {
			let mut query = content::table
				.filter(content::published.eq(true))
				.filter(content::site_id.eq(site_id))
				.filter(languages::key.eq(lang))
				.inner_join(languages::table.on(languages::id.eq(content::language_id)))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			}

			if let Some(content_types) = content_types {
				query = query.filter(content::content_type_id.eq_any(content_types));
			}

			query
		};

		let total_query = {
			let mut query = content::table
				.filter(content::published.eq(true))
				.filter(content::site_id.eq(site_id))
				.filter(languages::key.eq(lang))
				.inner_join(languages::table.on(languages::id.eq(content::language_id)))
				.into_boxed();

			if let Some(content_types) = content_types {
				query = query.filter(content::content_type_id.eq_any(content_types));
			}

			query
		};

		let content: Vec<(Content, Language)> = query
			.select((Content::as_select(), Language::as_select()))
			.load::<(Content, Language)>(conn)?;

		let mapped_content = content
			.into_iter()
			.map(|(content_item, language)| {
				let (revision, fields, translations) =
					Self::find_field_content(conn, site_id, &content_item, populate)?;

				Ok((content_item, revision, fields, language, translations))
			})
			.collect::<Result<
				Vec<(
					Self,
					ContentRevision,
					Vec<ContentField>,
					Language,
					Vec<(Self, Language)>,
				)>,
				AppError,
			>>()?;

		let total_elements = total_query.count().get_result::<i64>(conn)?;

		Ok((mapped_content, total_elements))
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
	pub fn find<'a>(
		conn: &mut PgConnection,
		site_id: &Uuid,
		page: &'a i64,
		pagesize: &'a i64,
		kind: &'a Option<ContentTypeKindEnum>,
		language_id: &'a Option<Uuid>,
		translation_id: &'a Option<Uuid>,
		content_types: &'a Option<Vec<Uuid>>,
		order: &'a Option<String>,
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

			if *pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(*pagesize);
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

			if let Some(order) = order {
				query = match order.as_str() {
					"createdAt" => query.order(content::created_at),
					"updatedAt" => query.order(content::updated_at),
					"published" => query.order(content::published),
					"contentType" => query.order(content::content_type_id),
					_ => query.order(content::updated_at),
				};
			} else {
				query = query.order(content::updated_at.desc());
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
	pub published: Option<bool>,
	pub workflow_state_id: Uuid,
	pub updated_at: NaiveDateTime,
}
