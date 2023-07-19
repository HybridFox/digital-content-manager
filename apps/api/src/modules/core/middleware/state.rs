use crate::errors::AppError;
use crate::modules::assets::services::s3_client::Client;
use crate::utils;
use diesel::pg::PgConnection;
use diesel::r2d2::{ConnectionManager, PooledConnection};

pub type AppConn = PooledConnection<ConnectionManager<PgConnection>>;

#[derive(Clone, Debug)]
pub struct AppState {
	pub pool: utils::db::DbPool,
	pub s3: Client
}

impl AppState {
	pub fn get_conn(&self) -> Result<AppConn, AppError> {
		let conn = self.pool.get()?;
		Ok(conn)
	}
}
 