// @generated automatically by Diesel CLI.

diesel::table! {
	iam_actions (key) {
		key -> Text,
		description -> Nullable<Text>,
		active -> Bool,
		deprecated -> Bool,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	iam_conditions (key) {
		key -> Text,
		description -> Nullable<Text>,
		active -> Bool,
		deprecated -> Bool,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	iam_policies (id) {
		id -> Uuid,
		name -> Text,
		team_id -> Uuid,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	permissions (id) {
		id -> Uuid,
		iam_policy_id -> Uuid,
		resources -> Jsonb,
		effect -> Text,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	permissions_iam_actions (permission_id, iam_action_key) {
		iam_action_key -> Text,
		permission_id -> Uuid,
		active -> Nullable<Bool>,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	permissions_iam_conditions (permission_id, iam_condition_key) {
		iam_condition_key -> Text,
		permission_id -> Uuid,
		value -> Jsonb,
		active -> Nullable<Bool>,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	roles (id) {
		id -> Uuid,
		name -> Text,
		slug -> Text,
		description -> Nullable<Text>,
		team_id -> Uuid,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	roles_iam_policies (role_id, iam_policy_id) {
		iam_policy_id -> Uuid,
		role_id -> Uuid,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	teams (id) {
		id -> Uuid,
		slug -> Text,
		name -> Text,
		description -> Nullable<Text>,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	teams_users (team_id, user_id) {
		user_id -> Uuid,
		team_id -> Uuid,
		role_id -> Uuid,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	teams_users_iam_policies (team_id, user_id, iam_policy_id) {
		user_id -> Uuid,
		team_id -> Uuid,
		iam_policy_id -> Uuid,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	users (id) {
		id -> Uuid,
		email -> Text,
		name -> Text,
		source -> Text,
		password -> Text,
		bio -> Nullable<Text>,
		image -> Nullable<Text>,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::joinable!(iam_policies -> teams (team_id));
diesel::joinable!(permissions -> iam_policies (iam_policy_id));
diesel::joinable!(permissions_iam_actions -> iam_actions (iam_action_key));
diesel::joinable!(permissions_iam_actions -> permissions (permission_id));
diesel::joinable!(permissions_iam_conditions -> iam_conditions (iam_condition_key));
diesel::joinable!(permissions_iam_conditions -> permissions (permission_id));
diesel::joinable!(roles -> teams (team_id));
diesel::joinable!(roles_iam_policies -> iam_policies (iam_policy_id));
diesel::joinable!(roles_iam_policies -> roles (role_id));
diesel::joinable!(teams_users -> roles (role_id));
diesel::joinable!(teams_users -> teams (team_id));
diesel::joinable!(teams_users -> users (user_id));
diesel::joinable!(teams_users_iam_policies -> iam_policies (iam_policy_id));
diesel::joinable!(teams_users_iam_policies -> teams (team_id));
diesel::joinable!(teams_users_iam_policies -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
	iam_actions,
	iam_conditions,
	iam_policies,
	permissions,
	permissions_iam_actions,
	permissions_iam_conditions,
	roles,
	roles_iam_policies,
	teams,
	teams_users,
	teams_users_iam_policies,
	users,
);
