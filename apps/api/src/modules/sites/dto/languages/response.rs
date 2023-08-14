use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::modules::{core::models::hal::{HALLinkList, HALPage}, languages::models::language::Language};

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

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct LanguagesEmbeddedDTO {
	pub languages: Vec<LanguageDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct LanguagesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: LanguagesEmbeddedDTO,
}

impl From<(Vec<Language>, HALPage)> for LanguagesDTO {
	fn from((languages, page): (Vec<Language>, HALPage)) -> Self {
		Self {
			_links: HALLinkList::from(("/api/v1/languages".to_owned(), &page)),
			_embedded: LanguagesEmbeddedDTO {
				languages: languages
					.into_iter()
					.map(|user| LanguageDTO::from(user))
					.collect(),
			},
			_page: page,
		}
	}
}
