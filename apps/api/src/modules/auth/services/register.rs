use crate::errors::AppError;
use crate::modules::authentication_methods::models::authentication_method::AuthenticationMethod;
use crate::modules::authentication_methods::models::authentication_method_role::AuthenticationMethodRole;
use crate::modules::sites::models::site_user::SiteUser;
use crate::modules::sites::models::site_user_role::SiteUserRole;
use crate::modules::users::models::user::User;
use crate::modules::users::models::user_role::UserRole;
use crate::schema::authentication_method_roles;
use diesel::PgConnection;
use tracing::instrument;
use uuid::Uuid;
use diesel::prelude::*;

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

#[instrument(skip(conn))]
pub fn persist_role_assignments(
	conn: &mut PgConnection,
	user_id: Uuid,
	authentication_method_id: Option<Uuid>,
) -> Result<(), AppError> {
	let auth_method_id = if authentication_method_id.is_some() {
		authentication_method_id.unwrap()
	} else {
		let local_auth_method = AuthenticationMethod::find_local(conn)?;
		local_auth_method.id
	};

	let authentication_method_roles: Vec<AuthenticationMethodRole> = authentication_method_roles::table
		.select(AuthenticationMethodRole::as_select())
		.filter(authentication_method_roles::authentication_method_id.eq(auth_method_id))
		.get_results::<AuthenticationMethodRole>(conn)?;

	let _ = authentication_method_roles
		.into_iter()
		.map(|assignment| {
			if assignment.site_id.is_none() {
				UserRole::upsert(conn, user_id, assignment.role_id)?;
				return Ok(())
			}

			SiteUser::upsert(conn, assignment.site_id.unwrap(), user_id)?;
			SiteUserRole::upsert(conn, user_id, assignment.site_id.unwrap(), assignment.role_id)?;

			Ok(())
		})
		.collect::<Result<Vec<()>, AppError>>()?;

	Ok(())
}

