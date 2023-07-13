use utoipa::{
	openapi::{
		security::{SecurityScheme, HttpBuilder, HttpAuthScheme},
	},
	OpenApi, Modify,
};

pub struct SecurityAddon;

impl Modify for SecurityAddon {
	fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
		let components = openapi.components.as_mut().unwrap(); // we can unwrap safely since there already is components registered.
		components.add_security_scheme(
			"jwt_token",
			SecurityScheme::Http(
				HttpBuilder::new()
					.scheme(HttpAuthScheme::Bearer)
					.bearer_format("JWT")
					.build(),
			),
		)
	}
}

#[derive(OpenApi)]
#[openapi(
	paths(
		super::modules::core::controllers::status::ping,

		super::modules::auth::controllers::auth::me,
		super::modules::auth::controllers::auth::update,
		super::modules::auth::controllers::local::login,
		super::modules::auth::controllers::local::register,
		super::modules::auth::controllers::google::login,
		super::modules::auth::controllers::google::callback,
		super::modules::auth::controllers::slack::login,
		super::modules::auth::controllers::slack::callback,

		super::modules::sites::controllers::sites::create,
		super::modules::sites::controllers::sites::find_all,
		super::modules::sites::controllers::sites::find_one,
		super::modules::sites::controllers::sites::update,
		super::modules::sites::controllers::sites::remove,

		super::modules::roles::controllers::roles::create,
		super::modules::roles::controllers::roles::find_all,
		super::modules::roles::controllers::roles::find_one,
		super::modules::roles::controllers::roles::update,
		super::modules::roles::controllers::roles::remove,

		super::modules::iam_policies::controllers::iam_policies::create,
		super::modules::iam_policies::controllers::iam_policies::find_all,
		super::modules::iam_policies::controllers::iam_policies::find_one,
		super::modules::iam_policies::controllers::iam_policies::update,
		super::modules::iam_policies::controllers::iam_policies::remove,

		super::modules::iam_actions::controllers::iam_actions::find_all,
		super::modules::iam_actions::controllers::iam_actions::find_one,

		super::modules::iam_conditions::controllers::iam_conditions::find_all,
		super::modules::iam_conditions::controllers::iam_conditions::find_one,
	),
	components(
		schemas(
			// Core
			super::errors::AppErrorValue,
			super::modules::core::models::hal::HALLink,
			super::modules::core::models::hal::HALLinkList,
			super::modules::core::models::hal::HALPage,

			// Auth
			super::modules::auth::dto::response::UserDTO,
			super::modules::auth::dto::request::LoginUserDTO,
			super::modules::auth::dto::request::RegisterUserDTO,
			super::modules::auth::dto::request::UpdateUserDTO,

			// Sites
			super::modules::sites::dto::response::SiteDTO,
			super::modules::sites::dto::response::SitesDTO,
			super::modules::sites::dto::response::SitesEmbeddedDTO,
			super::modules::sites::dto::request::CreateSiteDTO,
			super::modules::sites::dto::request::UpdateSiteDTO,

			// Roles
			super::modules::roles::dto::response::RoleDTO,
			super::modules::roles::dto::response::RoleWithPoliciesDTO,
			super::modules::roles::dto::response::RolesDTO,
			super::modules::roles::dto::response::RolesEmbeddedDTO,
			super::modules::roles::dto::request::CreateRoleDTO,
			super::modules::roles::dto::request::UpdateRoleDTO,

			// Policies
			super::modules::iam_policies::dto::response::IAMPolicyDTO,
			super::modules::iam_policies::dto::response::IAMPolicyWithPermissionsDTO,
			super::modules::iam_policies::dto::response::PermissionDTO,
			super::modules::iam_policies::dto::response::IAMPoliciesDTO,
			super::modules::iam_policies::dto::response::IAMPoliciesEmbeddedDTO,
			super::modules::iam_policies::dto::request::CreateIAMPolicyDTO,
			super::modules::iam_policies::dto::request::CreateIAMPolicyPermissionDTO,
			super::modules::iam_policies::dto::request::CreateIAMPolicyPermissionActionDTO,
			super::modules::iam_policies::dto::request::CreateIAMPolicyPermissionConditionDTO,
			super::modules::iam_policies::dto::request::UpdateIAMPolicyDTO,

			// IAM Actions
			super::modules::iam_actions::dto::response::IAMActionDTO,
			super::modules::iam_actions::dto::response::IAMActionsDTO,
			super::modules::iam_actions::dto::response::IAMActionsEmbeddedDTO,

			// IAM Conditions
			super::modules::iam_conditions::dto::response::IAMConditionDTO,
			super::modules::iam_conditions::dto::response::IAMConditionsDTO,
			super::modules::iam_conditions::dto::response::IAMConditionsEmbeddedDTO,
		)
	),
	modifiers(&SecurityAddon)
)]
pub struct ApiDoc;
