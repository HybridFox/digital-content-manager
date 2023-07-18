use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct HALLink {
	pub href: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct HALLinkList {
	pub first: HALLink,
	pub last: HALLink,
	pub prev: HALLink,
	pub next: HALLink,
}

impl From<(String, &HALPage)> for HALLinkList {
	fn from((url, page): (String, &HALPage)) -> Self {
		HALLinkList {
			first: HALLink {
				href: format!("{}?page=1&pagesize={}", url, page.size),
			},
			last: HALLink {
				href: format!("{}?page={}&pagesize={}", url, page.total_pages, page.size),
			},
			prev: HALLink {
				href: format!(
					"{}?page={}&pagesize={}",
					url,
					(page.number - 1).max(1),
					page.size
				),
			},
			next: HALLink {
				href: format!(
					"{}?page={}&pagesize={}",
					url,
					(page.number + 1).min(page.total_pages),
					page.size
				),
			},
		}
	}
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct HALPage {
	pub size: i64,
	pub total_elements: i64,
	pub total_pages: i64,
	pub number: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct HALEmbeddedResponse<T> {
	pub _links: Option<HALLinkList>,
	pub _embedded: T,
	pub _page: HALPage,
}
