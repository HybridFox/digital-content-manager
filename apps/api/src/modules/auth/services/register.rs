use crate::{errors::AppError, modules::core::middleware::state::AppConn};
use crate::modules::users::models::user::User;
use tracing::instrument;

#[instrument(skip(conn, password))]
pub async fn register_user(
	conn: &mut AppConn,
	email: &str,
	username: &str,
	password: &str,
	image: Option<&str>,
	source: Option<&str>,
) -> Result<(User, String), AppError> {
	// TODO: move this logic somewhere seperatly? Try to implement the `service` pattern perhaps?
	// Create the user account
	let (user, token) = User::signup(conn, email, username, password, image, source)?;

	Ok((user, token))
}
