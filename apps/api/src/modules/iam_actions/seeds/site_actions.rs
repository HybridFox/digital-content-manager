use crate::modules::iam_actions::models::iam_action::CreateIAMAction;

pub const SITE_IAM_ACTION_SEEDS: [CreateIAMAction<'_>; 52] = [
	CreateIAMAction {
		key: "sites::*",
		description: None,
	},
	/*
	 * content
	 */
	CreateIAMAction {
		key: "sites::content:*",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content:read",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content:create",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content:update",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content:remove",
		description: None,
	},
	/*
	 * content-types
	 */
	CreateIAMAction {
		key: "sites::content-types:*",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content-types:read",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content-types:create",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content-types:update",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content-types:remove",
		description: None,
	},
	/*
	 * content-components
	 */
	CreateIAMAction {
		key: "sites::content-components:*",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content-components:read",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content-components:create",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content-components:update",
		description: None,
	},
	CreateIAMAction {
		key: "sites::content-components:remove",
		description: None,
	},
	/*
	 * workflows
	 */
	CreateIAMAction {
		key: "sites::workflows:*",
		description: None,
	},
	CreateIAMAction {
		key: "sites::workflows:read",
		description: None,
	},
	CreateIAMAction {
		key: "sites::workflows:create",
		description: None,
	},
	CreateIAMAction {
		key: "sites::workflows:update",
		description: None,
	},
	CreateIAMAction {
		key: "sites::workflows:remove",
		description: None,
	},
	/*
	 * workflow-states
	 */
	CreateIAMAction {
		key: "sites::workflow-states:*",
		description: None,
	},
	CreateIAMAction {
		key: "sites::workflow-states:read",
		description: None,
	},
	CreateIAMAction {
		key: "sites::workflow-states:create",
		description: None,
	},
	CreateIAMAction {
		key: "sites::workflow-states:update",
		description: None,
	},
	CreateIAMAction {
		key: "sites::workflow-states:remove",
		description: None,
	},
	/*
	 * resources
	 */
	CreateIAMAction {
		key: "sites::resources:*",
		description: None,
	},
	CreateIAMAction {
		key: "sites::resources:read",
		description: None,
	},
	CreateIAMAction {
		key: "sites::resources:create-directory",
		description: None,
	},
	CreateIAMAction {
		key: "sites::resources:remove-directory",
		description: None,
	},
	CreateIAMAction {
		key: "sites::resources:upload-file",
		description: None,
	},
	CreateIAMAction {
		key: "sites::resources:remove-file",
		description: None,
	},
	/*
	 * Users
	 */
	CreateIAMAction {
		key: "sites::users:*",
		description: None,
	},
	CreateIAMAction {
		key: "sites::users:read",
		description: None,
	},
	CreateIAMAction {
		key: "sites::users:create",
		description: None,
	},
	CreateIAMAction {
		key: "sites::users:update",
		description: None,
	},
	CreateIAMAction {
		key: "sites::users:remove",
		description: None,
	},
	/*
	 * Roles
	 */
	CreateIAMAction {
		key: "sites::roles:*",
		description: None,
	},
	CreateIAMAction {
		key: "sites::roles:read",
		description: None,
	},
	CreateIAMAction {
		key: "sites::roles:create",
		description: None,
	},
	CreateIAMAction {
		key: "sites::roles:update",
		description: None,
	},
	CreateIAMAction {
		key: "sites::roles:remove",
		description: None,
	},
	/*
	 * Policies
	 */
	CreateIAMAction {
		key: "sites::policies:*",
		description: None,
	},
	CreateIAMAction {
		key: "sites::policies:read",
		description: None,
	},
	CreateIAMAction {
		key: "sites::policies:create",
		description: None,
	},
	CreateIAMAction {
		key: "sites::policies:update",
		description: None,
	},
	CreateIAMAction {
		key: "sites::policies:remove",
		description: None,
	},
	/*
	 * Storage Repositories
	 */
	CreateIAMAction {
		key: "sites::storage-repositories:*",
		description: None,
	},
	CreateIAMAction {
		key: "sites::storage-repositories:read",
		description: None,
	},
	CreateIAMAction {
		key: "sites::storage-repositories:create",
		description: None,
	},
	CreateIAMAction {
		key: "sites::storage-repositories:update",
		description: None,
	},
	CreateIAMAction {
		key: "sites::storage-repositories:remove",
		description: None,
	},
];
