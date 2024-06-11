use crate::modules::core::models::config_item::ConfigItem;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::convert::From;
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ConfigDTO(HashMap<String, Option<Value>>);

impl From<Vec<ConfigItem>> for ConfigDTO {
	fn from(config_items: Vec<ConfigItem>) -> Self {
		let hashmap = config_items
			.into_iter()
			.map(|config_item| (config_item.key, config_item.value))
			.collect::<HashMap<String, Option<Value>>>();

		ConfigDTO(hashmap)
	}
}
