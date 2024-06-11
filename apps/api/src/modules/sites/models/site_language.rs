use crate::modules::languages::models::language::Language;
use crate::modules::sites::models::site::Site;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;

use crate::errors::AppError;
use crate::schema::{languages, sites_languages};

#[derive(Identifiable, Selectable, Queryable, Associations, Debug)]
#[diesel(belongs_to(Language))]
#[diesel(belongs_to(Site))]
#[diesel(table_name = sites_languages)]
#[diesel(primary_key(language_id, site_id))]
pub struct SiteLanguage {
	pub language_id: Uuid,
	pub site_id: Uuid,
}

impl SiteLanguage {
	pub fn upsert(
		conn: &mut PgConnection,
		site_id: Uuid,
		language_ids: Vec<Uuid>,
	) -> Result<Vec<Language>, AppError> {
		let target = sites_languages::table.filter(sites_languages::site_id.eq(site_id));
		diesel::delete(target).execute(conn)?;

		let insertables = language_ids
			.into_iter()
			.map(|language_id| CreateSiteLanguage {
				language_id,
				site_id,
			})
			.collect::<Vec<CreateSiteLanguage>>();

		let site_languages = diesel::insert_into(sites_languages::table)
			.values(insertables)
			.returning(SiteLanguage::as_returning())
			.get_results(conn)?;
		let id_indices: Vec<Uuid> = site_languages
			.into_iter()
			.map(|site_language| site_language.language_id)
			.collect();

		let languages = languages::table
			.filter(languages::id.eq_any(id_indices))
			.select(Language::as_select())
			.load::<Language>(conn)?;

		Ok(languages)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = sites_languages)]
pub struct CreateSiteLanguage {
	pub site_id: Uuid,
	pub language_id: Uuid,
}
