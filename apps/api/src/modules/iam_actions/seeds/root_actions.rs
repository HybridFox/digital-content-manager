use crate::modules::iam_actions::models::iam_action::CreateIAMAction;

pub const ROOT_IAM_ACTION_SEEDS: [CreateIAMAction<'_>; 28] = [
	CreateIAMAction {
		key: "root::*",
		description: None,
	},
	/*
	 * Languages
	 */
	CreateIAMAction {
		key: "root::languages:*",
		description: None,
	},
	CreateIAMAction {
		key: "root::languages:read",
		description: None,
	},
	/*
	 * Users
	 */
	CreateIAMAction {
		key: "root::users:*",
		description: None,
	},
	CreateIAMAction {
		key: "root::users:read",
		description: None,
	},
	CreateIAMAction {
		key: "root::users:create",
		description: None,
	},
	CreateIAMAction {
		key: "root::users:update",
		description: None,
	},
	CreateIAMAction {
		key: "root::users:remove",
		description: None,
	},
	/*
	 * Roles
	 */
	CreateIAMAction {
		key: "root::roles:*",
		description: None,
	},
	CreateIAMAction {
		key: "root::roles:read",
		description: None,
	},
	CreateIAMAction {
		key: "root::roles:create",
		description: None,
	},
	CreateIAMAction {
		key: "root::roles:update",
		description: None,
	},
	CreateIAMAction {
		key: "root::roles:remove",
		description: None,
	},
	/*
	 * Policies
	 */
	CreateIAMAction {
		key: "root::policies:*",
		description: None,
	},
	CreateIAMAction {
		key: "root::policies:read",
		description: None,
	},
	CreateIAMAction {
		key: "root::policies:create",
		description: None,
	},
	CreateIAMAction {
		key: "root::policies:update",
		description: None,
	},
	CreateIAMAction {
		key: "root::policies:remove",
		description: None,
	},
	/*
	 * Authentication Methods
	 */
	CreateIAMAction {
		key: "root::authentication-methods:*",
		description: None,
	},
	CreateIAMAction {
		key: "root::authentication-methods:read",
		description: None,
	},
	CreateIAMAction {
		key: "root::authentication-methods:create",
		description: None,
	},
	CreateIAMAction {
		key: "root::authentication-methods:update",
		description: None,
	},
	CreateIAMAction {
		key: "root::authentication-methods:remove",
		description: None,
	},
	/*
	 * Sites
	 */
	CreateIAMAction {
		key: "root::sites:*",
		description: None,
	},
	CreateIAMAction {
		key: "root::sites:read",
		description: None,
	},
	CreateIAMAction {
		key: "root::sites:create",
		description: None,
	},
	CreateIAMAction {
		key: "root::sites:update",
		description: None,
	},
	CreateIAMAction {
		key: "root::sites:remove",
		description: None,
	},
];
