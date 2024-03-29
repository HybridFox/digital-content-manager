use actix::prelude::*;

use crate::utils::db::DbPool;

pub struct HookActor;

#[derive(Message)]
#[rtype(result = "usize")]
pub struct Ping(usize);

impl Actor for HookActor {
	type Context = SyncContext<Self>;
}

impl Handler<Ping> for HookActor {
	type Result = usize;

	fn handle(&mut self, msg: Ping, _sctx: &mut SyncContext<Self>) -> Self::Result {
		self.count += msg.0;

		self.count
	}
}
