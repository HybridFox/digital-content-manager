use crate::{
	errors::AppError,
	modules::{core::middleware::state::AppConn},
};
use crate::modules::iam_policies::models::iam_policy::IAMPolicy;
use crate::modules::iam_policies::models::permission::Permission;
use crate::modules::iam_policies::models::permission_iam_action::PermissionIAMAction;
use crate::modules::roles::models::role::Role;
use crate::modules::auth::models::user::User;
use crate::modules::sites::models::site::Site;
use crate::modules::sites::models::site_user::SiteUser;
use pluralizer::pluralize;
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

	// Create a site for the user
	let site = Site::create(conn, &format!("{}'s site", pluralize(&user.name, 2, false)))?;

	// Create policies for the role
	let policy = IAMPolicy::create(conn, site.id, "Default policy")?;
	let permission =
		Permission::create(conn, policy.id, vec!["*".to_string()], "grant".to_owned())?;
	PermissionIAMAction::create(conn, permission.id, vec!["*".to_string()])?;

	// Asign policy to role
	let (role, _) = Role::create(conn, site.id, "Default site".to_string(), vec![policy.id])?;

	// Assign user to site
	let _site_user = SiteUser::create(conn, user.id, site.id, role.id)?;

	Ok((user, token))
}
