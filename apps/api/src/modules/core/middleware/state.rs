use crate::errors::AppError;
use crate::modules::core::actors::hook::HookActor;
use crate::utils;
use actix::Addr;
use diesel::pg::PgConnection;
use diesel::r2d2::{ConnectionManager, PooledConnection};

pub type AppConn = PooledConnection<ConnectionManager<PgConnection>>;

#[derive(Clone, Debug)]
pub struct AppState {
	pub pool: utils::db::DbPool,
	pub hook_addr: Addr<HookActor>,
}

impl AppState {
	pub fn get_conn(&self) -> Result<AppConn, AppError> {
		let conn = self.pool.get()?;
		Ok(conn)
	}
}
