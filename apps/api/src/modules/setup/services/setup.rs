use crate::{
	errors::AppError,
	modules::{core::middleware::state::AppConn, sites::models::user_role::UserRole},
};
use crate::modules::iam_policies::models::iam_policy::IAMPolicy;
use crate::modules::iam_policies::models::permission::Permission;
use crate::modules::iam_policies::models::permission_iam_action::PermissionIAMAction;
use crate::modules::roles::models::role::Role;
use crate::modules::auth::models::user::User;
use tracing::instrument;

#[instrument(skip(conn, password))]
pub async fn setup_initial_user(
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

	// Create a site for the user
	// let site = Site::create(conn, &format!("{}'s site", pluralize(&user.name, 2, false)))?;

	// Create policies for the role
	let policy = IAMPolicy::create(conn, None, "Default Admin Policy")?;
	let permission =
		Permission::create(conn, policy.id, vec!["*".to_string()], "grant".to_owned())?;
	PermissionIAMAction::create(conn, permission.id, vec!["*".to_string()])?;

	// Asign policy to role
	let (role, _) = Role::create(conn, None, "Default Admin Role".to_string(), vec![policy.id])?;

	// Assign user to site
	// let _site_user = SiteUser::create(conn, user.id, site.id)?;
	let _site_user_role = UserRole::create(conn, user.id, role.id)?;

	Ok((user, token))
}
