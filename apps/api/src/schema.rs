// @generated automatically by Diesel CLI.

pub mod sql_types {
	#[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
	#[diesel(postgres_type(name = "field_types"))]
	pub struct FieldTypes;
}

diesel::table! {
	asset_metadata (id) {
		id -> Uuid,
		asset_id -> Uuid,
		label -> Text,
		value -> Text,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	assets (id) {
		id -> Uuid,
		site_id -> Uuid,
		name -> Text,
		description -> Nullable<Text>,
		file_reference -> Text,
		file_extension -> Text,
		file_mime -> Text,
		file_size -> Int8,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	content_components (id) {
		id -> Uuid,
		name -> Text,
		slug -> Text,
		component_name -> Text,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	content_types (id) {
		id -> Uuid,
		name -> Text,
		description -> Nullable<Text>,
		slug -> Text,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	field_config (id) {
		id -> Uuid,
		field_id -> Uuid,
		config_key -> Text,
		config_type -> Text,
		content -> Text,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	use diesel::sql_types::*;
	use super::sql_types::FieldTypes;

	fields (id) {
		id -> Uuid,
		name -> Text,
		slug -> Text,
		description -> Nullable<Text>,
		min -> Int4,
		max -> Int4,
		hidden -> Bool,
		multi_language -> Bool,
		field_type -> FieldTypes,
		parent_id -> Uuid,
		content_component_id -> Uuid,
	}
}

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
		site_id -> Uuid,
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
		site_id -> Uuid,
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
	sites (id) {
		id -> Uuid,
		slug -> Text,
		name -> Text,
		url -> Nullable<Text>,
		image -> Nullable<Text>,
		description -> Nullable<Text>,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	sites_content_types (site_id, content_type_id) {
		site_id -> Uuid,
		content_type_id -> Uuid,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	sites_users (site_id, user_id) {
		user_id -> Uuid,
		site_id -> Uuid,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	sites_users_iam_policies (site_id, user_id, iam_policy_id) {
		user_id -> Uuid,
		site_id -> Uuid,
		iam_policy_id -> Uuid,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	sites_users_roles (site_id, user_id) {
		user_id -> Uuid,
		site_id -> Uuid,
		role_id -> Uuid,
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
		avatar -> Nullable<Text>,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::joinable!(iam_policies -> sites (site_id));
diesel::joinable!(permissions -> iam_policies (iam_policy_id));
diesel::joinable!(permissions_iam_actions -> iam_actions (iam_action_key));
diesel::joinable!(permissions_iam_actions -> permissions (permission_id));
diesel::joinable!(permissions_iam_conditions -> iam_conditions (iam_condition_key));
diesel::joinable!(permissions_iam_conditions -> permissions (permission_id));
diesel::joinable!(roles -> sites (site_id));
diesel::joinable!(roles_iam_policies -> iam_policies (iam_policy_id));
diesel::joinable!(roles_iam_policies -> roles (role_id));
diesel::joinable!(sites_content_types -> content_types (content_type_id));
diesel::joinable!(sites_content_types -> sites (site_id));
diesel::joinable!(sites_users -> sites (site_id));
diesel::joinable!(sites_users -> users (user_id));
diesel::joinable!(sites_users_iam_policies -> iam_policies (iam_policy_id));
diesel::joinable!(sites_users_iam_policies -> sites (site_id));
diesel::joinable!(sites_users_iam_policies -> users (user_id));
diesel::joinable!(sites_users_roles -> roles (role_id));
diesel::joinable!(sites_users_roles -> sites (site_id));
diesel::joinable!(sites_users_roles -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
	asset_metadata,
	assets,
	content_components,
	content_types,
	field_config,
	fields,
	iam_actions,
	iam_conditions,
	iam_policies,
	permissions,
	permissions_iam_actions,
	permissions_iam_conditions,
	roles,
	roles_iam_policies,
	sites,
	sites_content_types,
	sites_users,
	sites_users_iam_policies,
	sites_users_roles,
	users,
);
