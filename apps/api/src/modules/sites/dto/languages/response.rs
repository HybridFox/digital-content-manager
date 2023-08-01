use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::modules::sites::models::language::Language;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct LanguageDTO {
	id: Uuid,
	key: String,
	name: String,
}

impl From<Language> for LanguageDTO {
	fn from(language: Language) -> Self {
		Self {
			id: language.id,
			key: language.key,
			name: language.name,
		}
	}
}
