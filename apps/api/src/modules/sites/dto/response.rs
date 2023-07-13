use crate::modules::{
	sites::models::site::Site,
	core::models::hal::{HALLinkList, HALPage},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::{ToSchema};
use uuid::Uuid;
use std::{convert::From};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SiteDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<Site> for SiteDTO {
	fn from(site: Site) -> Self {
		Self {
			id: site.id,
			name: site.name,
			slug: site.slug,
			created_at: site.created_at,
			updated_at: site.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SitesEmbeddedDTO {
	pub sites: Vec<SiteDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SitesDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: SitesEmbeddedDTO,
}

impl From<(Vec<Site>, HALPage)> for SitesDTO {
	fn from((sites, page): (Vec<Site>, HALPage)) -> Self {
		Self {
			_links: HALLinkList::from(("/api/v1/sites".to_owned(), &page)),
			_embedded: SitesEmbeddedDTO {
				sites: sites
					.iter()
					.map(|site| SiteDTO::from(site.clone()))
					.collect(),
			},
			_page: page,
		}
	}
}
