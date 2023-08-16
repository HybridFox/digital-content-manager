use crate::errors::AppError;
use crate::modules::authentication_methods::models::authentication_method::AuthenticationMethod;
use crate::modules::users::models::user::User;
use diesel::PgConnection;
use tracing::instrument;
use uuid::Uuid;

#[instrument(skip(conn, password))]
pub async fn register_user(
	conn: &mut PgConnection,
	email: &str,
	username: &str,
	password: &str,
	image: Option<&str>,
	authentication_method_id: Option<Uuid>,
) -> Result<(User, String), AppError> {
	// TODO: move this logic somewhere seperatly? Try to implement the `service` pattern perhaps?
	// Create the user account
	let auth_method_id = if authentication_method_id.is_some() {
		authentication_method_id.unwrap()
	} else {
		let local_auth_method = AuthenticationMethod::find_local(conn)?;
		local_auth_method.id
	};

	let (user, token) = User::signup(conn, email, username, password, image, auth_method_id)?;

	Ok((user, token))
}
