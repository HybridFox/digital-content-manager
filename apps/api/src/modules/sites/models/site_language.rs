use crate::modules::sites::models::language::Language;
use crate::modules::sites::models::site::Site;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;

use crate::errors::AppError;
use crate::schema::sites_languages;

#[derive(Identifiable, Selectable, Queryable, Associations, Debug)]
#[diesel(belongs_to(Language))]
#[diesel(belongs_to(Site))]
#[diesel(table_name = sites_languages)]
#[diesel(primary_key(language_id, site_id))]
pub struct SiteLanguage {
	pub language_id: Uuid,
	pub site_id: Uuid
}

impl SiteLanguage {
	pub fn create(
		conn: &mut PgConnection,
		language_id: Uuid,
		site_id: Uuid,
	) -> Result<Self, AppError> {
		let site_language = diesel::insert_into(sites_languages::table)
			.values(CreateSiteLanguage { language_id, site_id })
			.returning(SiteLanguage::as_returning())
			.get_result(conn)?;

		Ok(site_language)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = sites_languages)]
pub struct CreateSiteLanguage {
	pub site_id: Uuid,
	pub language_id: Uuid,
}
