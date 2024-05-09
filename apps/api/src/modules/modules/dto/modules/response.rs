use crate::modules::{
	core::models::hal::{HALLinkList, HALPage},
	modules::models::module::Module,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use std::convert::From;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ModuleDTO {
	pub id: Uuid,
	pub name: String,
	pub entry_url: String,
	pub active: bool,
}

impl From<Module> for ModuleDTO {
	fn from(module: Module) -> Self {
		Self {
			id: module.id,
			name: module.name,
			entry_url: module.entry_url,
			active: module.active,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ModulesEmbeddedDTO {
	pub modules: Vec<ModuleDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ModulesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: ModulesEmbeddedDTO,
}

impl From<(Vec<Module>, HALPage, Uuid)> for ModulesDTO {
	fn from((modules, page, site_id): (Vec<Module>, HALPage, Uuid)) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{}/modules", site_id), &page)),
			_embedded: ModulesEmbeddedDTO {
				modules: modules.into_iter().map(ModuleDTO::from).collect(),
			},
			_page: page,
		}
	}
}
