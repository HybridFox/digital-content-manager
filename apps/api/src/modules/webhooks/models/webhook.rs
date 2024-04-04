use diesel::prelude::*;
use serde::Deserialize;
use serde_json::Value;
use uuid::Uuid;
use tracing::instrument;

use crate::errors::AppError;
use crate::schema::webhooks;

#[derive(Identifiable, Selectable, Queryable, Debug, Clone)]
#[diesel(table_name = webhooks)]
#[diesel(primary_key(id))]
pub struct Webhook {
	pub id: Uuid,
	pub event: String,
	pub url: String,
	pub active: bool,
	pub site_id: Uuid,
	pub request_configuration: Option<Value>,
}

impl Webhook {
	#[instrument(skip(conn))]
	pub fn create(conn: &mut PgConnection, webhook: CreateWebhook) -> Result<Self, AppError> {
		let created_webhook = diesel::insert_into(webhooks::table)
			.values(webhook)
			.returning(Webhook::as_returning())
			.get_result(conn)?;

		Ok(created_webhook)
	}

	#[instrument(skip(conn))]
	pub fn find_one(conn: &mut PgConnection, id: Uuid) -> Result<Self, AppError> {
		let webhook = webhooks::table.find(id).first::<Self>(conn)?;

		Ok(webhook)
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
		all: Option<bool>,
	) -> Result<(Vec<Self>, i64), AppError> {
		let query = {
			let mut query = webhooks::table
				.filter(webhooks::site_id.eq(site_id))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			if all.is_none() || all.unwrap_or(false) == false {
				query = query.filter(webhooks::active.eq(true))
			}

			query
		};

		let webhooks = query.select(Webhook::as_select()).load::<Webhook>(conn)?;
		let total_elements = webhooks::table.count().get_result::<i64>(conn)?;

		Ok((webhooks, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		id: Uuid,
		changeset: UpdateWebhook,
	) -> Result<Self, AppError> {
		let target = webhooks::table.find(id);
		let updated_webhook = diesel::update(target)
			.set(changeset)
			.returning(Self::as_returning())
			.get_result::<Self>(conn)?;

		Ok(updated_webhook)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_id: Uuid) -> Result<(), AppError> {
		diesel::delete(webhooks::table.filter(webhooks::id.eq(content_id)))
			.get_result::<Webhook>(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = webhooks)]
pub struct CreateWebhook {
	pub event: String,
	pub url: String,
	pub site_id: Uuid,
	pub request_configuration: Option<Value>,
	pub active: bool,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = webhooks)]
pub struct UpdateWebhook {
	pub event: Option<String>,
	pub url: Option<String>,
	pub request_configuration: Option<Value>,
	pub active: Option<bool>,
}
