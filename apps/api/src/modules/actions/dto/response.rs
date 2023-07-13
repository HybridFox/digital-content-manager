use crate::modules::{
	teams::models::team::Team,
	core::models::hal::{HALLinkList, HALPage},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use utoipa::{ToSchema};
use uuid::Uuid;
use std::{convert::From};

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct TeamDTO {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl From<Team> for TeamDTO {
	fn from(team: Team) -> Self {
		Self {
			id: team.id,
			name: team.name,
			slug: team.slug,
			created_at: team.created_at,
			updated_at: team.updated_at,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct TeamsEmbeddedDTO {
	pub teams: Vec<TeamDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct TeamsDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: TeamsEmbeddedDTO,
}

impl From<(Vec<Team>, HALPage)> for TeamsDTO {
	fn from((teams, page): (Vec<Team>, HALPage)) -> Self {
		Self {
			_links: HALLinkList::from(("/api/v1/teams".to_owned(), &page)),
			_embedded: TeamsEmbeddedDTO {
				teams: teams
					.iter()
					.map(|team| TeamDTO::from(team.clone()))
					.collect(),
			},
			_page: page,
		}
	}
}
