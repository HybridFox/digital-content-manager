use crate::modules::languages::models::language::Language;
use crate::schema::{languages, sites, sites_users};
use crate::{errors::AppError, schema::sites_languages};
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use slug::slugify;
use tracing::instrument;
use uuid::Uuid;

use super::site_language::SiteLanguage;
use super::site_user::SiteUser;

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = sites)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Site {
	pub id: Uuid,
	pub slug: String,
	pub name: String,
	pub url: Option<String>,
	pub image: Option<String>,
	pub description: Option<String>,
	pub deleted: bool,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl Site {
	#[instrument(skip(conn))]
	pub fn create(conn: &mut PgConnection, name: &str) -> Result<Site, AppError> {
		use diesel::prelude::*;

		let record = CreateSite {
			name,
			slug: &slugify(name),
		};

		let site = diesel::insert_into(sites::table)
			.values(&record)
			.returning(Site::as_returning())
			.get_result::<Site>(conn)?;

		Ok(site)
	}

	pub fn find_one(conn: &mut PgConnection, id: Uuid) -> Result<(Self, Vec<Language>), AppError> {
		let t = sites::table.find(id);
		let site = t.get_result::<Site>(conn)?;

		let languages = SiteLanguage::belonging_to(&site)
			.inner_join(languages::table.on(languages::id.eq(sites_languages::language_id)))
			.select(Language::as_select())
			.load::<Language>(conn)?;

		Ok((site, languages))
	}

	pub fn find(
		conn: &mut PgConnection,
		page: i64,
		pagesize: i64,
		user_id: Uuid,
	) -> Result<(Vec<(Self, Option<bool>, Vec<Language>)>, i64), AppError> {
		let query = {
			let mut query = sites::table
				.left_join(
					sites_users::table.on(sites_users::site_id
						.eq(sites::id)
						.and(sites_users::user_id.eq(user_id))),
				)
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let sites: Vec<(Site, Option<SiteUser>)> = query
			.select((Site::as_select(), Option::<SiteUser>::as_select()))
			.load::<(Site, Option<SiteUser>)>(conn)?;

		let languages = SiteLanguage::belonging_to(
			&sites
				.iter()
				.map(|(site, _site_user)| site)
				.collect::<Vec<&Site>>(),
		)
		.inner_join(languages::table.on(languages::id.eq(sites_languages::language_id)))
		.select((SiteLanguage::as_select(), Language::as_select()))
		.load::<(SiteLanguage, Language)>(conn)?;
		let grouped_languages = languages.grouped_by(
			&sites
				.iter()
				.map(|(site, _site_user)| site)
				.collect::<Vec<&Site>>(),
		);

		let result = sites
			.into_iter()
			.zip(grouped_languages)
			.map(|((site, site_user), site_languages)| {
				let languages = site_languages
					.into_iter()
					.map(|(_site_language, language)| language)
					.collect::<Vec<Language>>();
				(site, Some(site_user.is_some()), languages)
			})
			.collect::<Vec<(Self, Option<bool>, Vec<Language>)>>();

		let total_elements = sites::table.count().get_result::<i64>(conn)?;

		Ok((result, total_elements))
	}

	pub fn update(
		conn: &mut PgConnection,
		site_id: Uuid,
		changeset: UpdateSite,
	) -> Result<Self, AppError> {
		let target = sites::table.find(site_id);
		let site = diesel::update(target)
			.set(changeset)
			.get_result::<Site>(conn)?;
		Ok(site)
	}

	pub fn remove(conn: &mut PgConnection, site_id: Uuid) -> Result<(), AppError> {
		let target = sites::table.find(site_id);
		diesel::delete(target).get_result::<Site>(conn)?;
		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = sites)]
pub struct CreateSite<'a> {
	pub name: &'a str,
	pub slug: &'a str,
}

#[derive(AsChangeset, Debug, Deserialize)]
#[diesel(table_name = sites)]
pub struct UpdateSite {
	pub name: Option<String>,
}
