use crate::modules::iam_actions::models::iam_action::CreateIAMAction;

pub const IAM_ACTION_SEEDS: [CreateIAMAction<'_>; 25] = [
	/*
	 * Users
	 */
	CreateIAMAction {
		key: "users:*",
		description: None,
	},
	CreateIAMAction {
		key: "users:read",
		description: None,
	},
	CreateIAMAction {
		key: "users:create",
		description: None,
	},
	CreateIAMAction {
		key: "users:update",
		description: None,
	},
	CreateIAMAction {
		key: "users:remove",
		description: None,
	},
	/*
	 * Roles
	 */
	CreateIAMAction {
		key: "roles:*",
		description: None,
	},
	CreateIAMAction {
		key: "roles:read",
		description: None,
	},
	CreateIAMAction {
		key: "roles:create",
		description: None,
	},
	CreateIAMAction {
		key: "roles:update",
		description: None,
	},
	CreateIAMAction {
		key: "roles:remove",
		description: None,
	},
	/*
	 * Policies
	 */
	CreateIAMAction {
		key: "policies:*",
		description: None,
	},
	CreateIAMAction {
		key: "policies:read",
		description: None,
	},
	CreateIAMAction {
		key: "policies:create",
		description: None,
	},
	CreateIAMAction {
		key: "policies:update",
		description: None,
	},
	CreateIAMAction {
		key: "policies:remove",
		description: None,
	},
	/*
	 * Authentication Methods
	 */
	CreateIAMAction {
		key: "authentication-methods:*",
		description: None,
	},
	CreateIAMAction {
		key: "authentication-methods:read",
		description: None,
	},
	CreateIAMAction {
		key: "authentication-methods:create",
		description: None,
	},
	CreateIAMAction {
		key: "authentication-methods:update",
		description: None,
	},
	CreateIAMAction {
		key: "authentication-methods:remove",
		description: None,
	},
	/*
	 * Sites
	 */
	CreateIAMAction {
		key: "sites:*",
		description: None,
	},
	CreateIAMAction {
		key: "sites:read",
		description: None,
	},
	CreateIAMAction {
		key: "sites:create",
		description: None,
	},
	CreateIAMAction {
		key: "sites:update",
		description: None,
	},
	CreateIAMAction {
		key: "sites:remove",
		description: None,
	},
];
