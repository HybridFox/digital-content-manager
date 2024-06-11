use crate::modules::{
	content_types::models::compartment::CompartmentModel,
	core::models::hal::{HALLinkList, HALPage},
};
use serde::{Deserialize, Serialize};
use std::convert::From;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CompartmentDTO {
	pub id: Uuid,
	pub name: String,
	pub description: Option<String>,
}

impl From<CompartmentModel> for CompartmentDTO {
	fn from(compartment: CompartmentModel) -> Self {
		Self {
			id: compartment.id,
			name: compartment.name,
			description: compartment.description,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CompartmentsEmbeddedDTO {
	pub compartments: Vec<CompartmentDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct CompartmentsDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: CompartmentsEmbeddedDTO,
}

impl From<(Vec<CompartmentModel>, HALPage, Uuid, Uuid)> for CompartmentsDTO {
	fn from(
		(compartments, page, site_id, content_type_id): (
			Vec<CompartmentModel>,
			HALPage,
			Uuid,
			Uuid,
		),
	) -> Self {
		Self {
			_links: HALLinkList::from((
				format!(
					"/api/v1/sites/{}/content-types/{}/compartments",
					site_id, content_type_id
				),
				&page,
			)),
			_embedded: CompartmentsEmbeddedDTO {
				compartments: compartments.into_iter().map(CompartmentDTO::from).collect(),
			},
			_page: page,
		}
	}
}
