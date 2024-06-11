use crate::modules::{
	core::models::hal::{HALLinkList, HALPage},
	webhooks::models::webhook::Webhook,
};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::convert::From;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct WebhookDTO {
	pub id: Uuid,
	pub event: String,
	pub url: String,
	pub request_configuration: Option<Value>,
	pub active: bool,
}

impl From<Webhook> for WebhookDTO {
	fn from(webhook: Webhook) -> Self {
		Self {
			id: webhook.id,
			event: webhook.event,
			url: webhook.url,
			request_configuration: webhook.request_configuration,
			active: webhook.active,
		}
	}
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct WebhooksEmbeddedDTO {
	pub webhooks: Vec<WebhookDTO>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct WebhooksDTO {
	pub _links: HALLinkList,
	pub _page: HALPage,
	pub _embedded: WebhooksEmbeddedDTO,
}

impl From<(Vec<Webhook>, HALPage, Uuid)> for WebhooksDTO {
	fn from((webhooks, page, site_id): (Vec<Webhook>, HALPage, Uuid)) -> Self {
		Self {
			_links: HALLinkList::from((format!("/api/v1/sites/{}/webhooks", site_id), &page)),
			_embedded: WebhooksEmbeddedDTO {
				webhooks: webhooks.into_iter().map(WebhookDTO::from).collect(),
			},
			_page: page,
		}
	}
}
