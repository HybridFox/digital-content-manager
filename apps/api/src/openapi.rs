use utoipa::{
	openapi::security::{SecurityScheme, HttpBuilder, HttpAuthScheme},
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

		super::modules::content_types::controllers::content_types::create,
		super::modules::content_types::controllers::content_types::find_all,
		super::modules::content_types::controllers::content_types::find_one,
		super::modules::content_types::controllers::content_types::update,
		super::modules::content_types::controllers::content_types::update,
		super::modules::content_types::controllers::content_types::remove,

		super::modules::content_types::controllers::fields::create,
		super::modules::content_types::controllers::fields::find_all,
		super::modules::content_types::controllers::fields::find_one,
		super::modules::content_types::controllers::fields::update,
		super::modules::content_types::controllers::fields::remove,

		super::modules::content_types::controllers::blocks::create,
		super::modules::content_types::controllers::blocks::find_all,
		super::modules::content_types::controllers::blocks::find_one,
		super::modules::content_types::controllers::blocks::update,
		super::modules::content_types::controllers::blocks::remove,

		super::modules::content_types::controllers::compartments::create,
		super::modules::content_types::controllers::compartments::find_all,
		super::modules::content_types::controllers::compartments::find_one,
		super::modules::content_types::controllers::compartments::update,
		super::modules::content_types::controllers::compartments::update,
		super::modules::content_types::controllers::compartments::remove,

		super::modules::content_types::controllers::field_order::update_order,

		super::modules::content::controllers::content::create,
		super::modules::content::controllers::content::find_all,
		super::modules::content::controllers::content::find_one,
		super::modules::content::controllers::content::update,
		super::modules::content::controllers::content::update,
		super::modules::content::controllers::content::remove,

		super::modules::content_components::controllers::content_components::create,
		super::modules::content_components::controllers::content_components::find_all,
		super::modules::content_components::controllers::content_components::find_one,
		super::modules::content_components::controllers::content_components::update,
		super::modules::content_components::controllers::content_components::remove,

		super::modules::content_components::controllers::fields::create,
		super::modules::content_components::controllers::fields::find_all,
		super::modules::content_components::controllers::fields::find_one,
		super::modules::content_components::controllers::fields::update,
		super::modules::content_components::controllers::fields::remove,

		super::modules::workflows::controllers::workflows::create,
		super::modules::workflows::controllers::workflows::find_all,
		super::modules::workflows::controllers::workflows::find_one,
		super::modules::workflows::controllers::workflows::update,
		super::modules::workflows::controllers::workflows::remove,

		super::modules::workflows::controllers::workflow_states::create,
		super::modules::workflows::controllers::workflow_states::find_all,
		super::modules::workflows::controllers::workflow_states::find_one,
		super::modules::workflows::controllers::workflow_states::update,
		super::modules::workflows::controllers::workflow_states::remove,

		super::modules::webhooks::controllers::webhooks::create,
		super::modules::webhooks::controllers::webhooks::find_all,
		super::modules::webhooks::controllers::webhooks::find_one,
		super::modules::webhooks::controllers::webhooks::update,
		super::modules::webhooks::controllers::webhooks::remove,

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
			super::modules::auth::dto::response::AuthDTO,
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

			// Content Types
			super::modules::content_types::dto::content_types::response::ContentTypeDTO,
			super::modules::content_types::dto::content_types::response::ContentTypesDTO,
			super::modules::content_types::dto::content_types::response::ContentTypesEmbeddedDTO,
			super::modules::content_types::dto::content_types::request::CreateContentTypeDTO,
			super::modules::content_types::dto::content_types::request::UpdateContentTypeDTO,
			super::modules::content_types::models::content_type::ContentTypeKindEnum,

			// Fields
			super::modules::content_types::dto::fields::request::CreateFieldDTO,
			super::modules::content_types::dto::fields::response::FieldsDTO,
			super::modules::content_types::dto::fields::response::FieldsEmbeddedDTO,

			// Compartments
			super::modules::content_types::dto::compartments::request::CreateCompartmentDTO,
			super::modules::content_types::dto::compartments::request::UpdateCompartmentDTO,
			super::modules::content_types::dto::compartments::response::CompartmentsDTO,
			super::modules::content_types::dto::compartments::response::CompartmentDTO,
			super::modules::content_types::dto::compartments::response::CompartmentsEmbeddedDTO,

			// Content
			super::modules::content::dto::content::response::ContentDTO,
			super::modules::content::dto::content::response::ContentWithFieldsDTO,
			super::modules::content::dto::content::response::ContentListDTO,
			super::modules::content::dto::content::response::ContentListEmbeddedDTO,
			super::modules::content::dto::content::request::CreateContentDTO,
			super::modules::content::dto::content::request::UpdateContentDTO,

			// Content Components
			super::modules::content_components::dto::content_components::response::ContentComponentDTO,
			super::modules::content_components::dto::content_components::response::ContentComponentsDTO,
			super::modules::content_components::dto::content_components::response::ContentComponentWithFieldsDTO,
			super::modules::content_components::dto::content_components::response::FieldDTO,
			super::modules::content_components::dto::content_components::response::ContentComponentsEmbeddedDTO,
			super::modules::content_components::dto::content_components::request::CreateContentComponentDTO,

			// Workflows
			super::modules::workflows::dto::workflows::response::WorkflowDTO,
			super::modules::workflows::dto::workflows::response::WorkflowsDTO,
			super::modules::workflows::dto::workflows::response::WorkflowsEmbeddedDTO,
			super::modules::workflows::dto::workflows::response::WorkflowTransitionDTO,
			super::modules::workflows::dto::workflows::request::CreateWorkflowDTO,
			super::modules::workflows::dto::workflows::request::UpsertWorkflowTransitionDTO,
			super::modules::workflows::dto::workflows::request::UpdateWorkflowDTO,

			// Workflow States
			super::modules::workflows::models::workflow_state::WorkflowTechnicalStateEnum,
			super::modules::workflows::dto::workflow_states::response::WorkflowStateDTO,
			super::modules::workflows::dto::workflow_states::response::WorkflowStatesDTO,
			super::modules::workflows::dto::workflow_states::response::WorkflowStatesEmbeddedDTO,
			super::modules::workflows::dto::workflow_states::request::CreateWorkflowStateDTO,
			super::modules::workflows::dto::workflow_states::request::UpdateWorkflowStateDTO,

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
