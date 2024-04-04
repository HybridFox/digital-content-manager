use actix::prelude::*;
use diesel::prelude::*;
use serde_json::Value;
use uuid::Uuid;

use crate::{
	errors::AppError, modules::webhooks::models::webhook::Webhook, schema::webhooks,
	utils::db::DbPool,
};

pub struct HookActor;

#[derive(Message)]
#[rtype(result = "Result<bool, AppError>")]
pub struct HookMessage {
	pub pool: DbPool,
	pub event: String,
	pub site_id: Uuid,
	pub event_data: Value,
}

impl Actor for HookActor {
	type Context = SyncContext<Self>;
}

impl Handler<HookMessage> for HookActor {
	type Result = Result<bool, AppError>;

	fn handle(&mut self, msg: HookMessage, _sctx: &mut SyncContext<Self>) -> Self::Result {
		let conn = &mut msg.pool.get()?;

		let webhooks: Vec<Webhook> = webhooks::table
			.filter(
				webhooks::site_id
					.eq(msg.site_id)
					.and(webhooks::event.eq(msg.event)),
			)
			.select(Webhook::as_select())
			.load::<Webhook>(conn)?;

		dbg!(&webhooks);

		let _ = webhooks
			.into_iter()
			.map(|webhook| {
				let client = reqwest::blocking::Client::new();
				let _ = client.post(webhook.url).json(&msg.event_data).send()?;

				Ok(())
			})
			.collect::<Result<Vec<()>, AppError>>();

		Ok(true)
	}
}
