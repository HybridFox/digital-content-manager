// @generated automatically by Diesel CLI.

pub mod sql_types {
	#[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
	#[diesel(postgres_type(name = "content_type_kinds"))]
	pub struct ContentTypeKinds;

	#[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
	#[diesel(postgres_type(name = "data_types"))]
	pub struct DataTypes;

	#[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
	#[diesel(postgres_type(name = "field_config_types"))]
	pub struct FieldConfigTypes;

	#[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
	#[diesel(postgres_type(name = "field_types"))]
	pub struct FieldTypes;

	#[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
	#[diesel(postgres_type(name = "module_types"))]
	pub struct ModuleTypes;

	#[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
	#[diesel(postgres_type(name = "workflow_state_technical_states"))]
	pub struct WorkflowStateTechnicalStates;
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
		deleted -> Bool,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	authentication_method_roles (id) {
		id -> Uuid,
		authentication_method_id -> Uuid,
		site_id -> Nullable<Uuid>,
		role_id -> Uuid,
	}
}

diesel::table! {
	authentication_methods (id) {
		id -> Uuid,
		name -> Text,
		kind -> Text,
		configuration -> Nullable<Jsonb>,
		weight -> Int4,
		active -> Bool,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	compartments (id) {
		id -> Uuid,
		name -> Text,
		description -> Nullable<Text>,
		content_type_id -> Uuid,
	}
}

diesel::table! {
	content (id) {
		id -> Uuid,
		name -> Text,
		slug -> Text,
		workflow_state_id -> Uuid,
		translation_id -> Uuid,
		language_id -> Uuid,
		site_id -> Uuid,
		content_type_id -> Uuid,
		published -> Bool,
		deleted -> Bool,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	use diesel::sql_types::*;
	use super::sql_types::DataTypes;

	content_components (id) {
		id -> Uuid,
		name -> Text,
		slug -> Text,
		description -> Nullable<Text>,
		data_type -> DataTypes,
		hidden -> Bool,
		internal -> Bool,
		deleted -> Bool,
		removeable -> Bool,
		component_name -> Text,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	use diesel::sql_types::*;
	use super::sql_types::DataTypes;

	content_fields (id) {
		id -> Uuid,
		name -> Text,
		value -> Nullable<Jsonb>,
		parent_id -> Nullable<Uuid>,
		source_id -> Uuid,
		content_component_id -> Nullable<Uuid>,
		sequence_number -> Nullable<Int4>,
		data_type -> DataTypes,
	}
}

diesel::table! {
	content_revisions (id) {
		id -> Uuid,
		workflow_state_id -> Uuid,
		revision_translation_id -> Uuid,
		content_id -> Uuid,
		site_id -> Uuid,
		user_id -> Uuid,
		published -> Bool,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	use diesel::sql_types::*;
	use super::sql_types::ContentTypeKinds;

	content_types (id) {
		id -> Uuid,
		name -> Text,
		description -> Nullable<Text>,
		kind -> ContentTypeKinds,
		workflow_id -> Uuid,
		slug -> Text,
		deleted -> Bool,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	use diesel::sql_types::*;
	use super::sql_types::FieldConfigTypes;

	field_config (id) {
		id -> Uuid,
		field_id -> Uuid,
		config_key -> Text,
		config_type -> FieldConfigTypes,
		content -> Nullable<Text>,
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
		sequence_number -> Nullable<Int4>,
		compartment_id -> Nullable<Uuid>,
		validation -> Nullable<Jsonb>,
	}
}

diesel::table! {
	iam_actions (key) {
		key -> Text,
		description -> Nullable<Text>,
		derived_actions -> Nullable<Jsonb>,
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
		site_id -> Nullable<Uuid>,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	languages (id) {
		id -> Uuid,
		key -> Text,
		name -> Text,
	}
}

diesel::table! {
	use diesel::sql_types::*;
	use super::sql_types::ModuleTypes;

	modules (id) {
		id -> Uuid,
		name -> Text,
		#[sql_name = "type"]
		type_ -> ModuleTypes,
		active -> Bool,
		site_id -> Uuid,
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
		site_id -> Nullable<Uuid>,
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
		deleted -> Bool,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	sites_content_components (site_id, content_component_id) {
		site_id -> Uuid,
		content_component_id -> Uuid,
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
	sites_languages (site_id, language_id) {
		site_id -> Uuid,
		language_id -> Uuid,
	}
}

diesel::table! {
	sites_storage_repositories (site_id, storage_repository_id) {
		site_id -> Uuid,
		storage_repository_id -> Uuid,
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
	sites_users_roles (site_id, user_id, role_id) {
		user_id -> Uuid,
		site_id -> Uuid,
		role_id -> Uuid,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	storage_repositories (id) {
		id -> Uuid,
		name -> Text,
		kind -> Text,
		configuration -> Jsonb,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	users (id) {
		id -> Uuid,
		email -> Text,
		name -> Text,
		password -> Text,
		bio -> Nullable<Text>,
		avatar -> Nullable<Text>,
		authentication_method_id -> Uuid,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	users_roles (user_id, role_id) {
		user_id -> Uuid,
		role_id -> Uuid,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	use diesel::sql_types::*;
	use super::sql_types::WorkflowStateTechnicalStates;

	workflow_states (id) {
		id -> Uuid,
		name -> Text,
		slug -> Text,
		description -> Nullable<Text>,
		technical_state -> WorkflowStateTechnicalStates,
		internal -> Bool,
		removable -> Bool,
		deleted -> Bool,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	workflow_transition_requirements (id) {
		id -> Uuid,
		workflow_transition_id -> Uuid,
		#[sql_name = "type"]
		type_ -> Text,
		value -> Jsonb,
	}
}

diesel::table! {
	workflow_transitions (id) {
		id -> Uuid,
		workflow_id -> Uuid,
		from_workflow_state_id -> Uuid,
		to_workflow_state_id -> Uuid,
	}
}

diesel::table! {
	workflows (id) {
		id -> Uuid,
		name -> Text,
		slug -> Text,
		description -> Nullable<Text>,
		default_workflow_state_id -> Uuid,
		internal -> Bool,
		removable -> Bool,
		active -> Bool,
		deleted -> Bool,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::joinable!(asset_metadata -> assets (asset_id));
diesel::joinable!(authentication_method_roles -> authentication_methods (authentication_method_id));
diesel::joinable!(authentication_method_roles -> roles (role_id));
diesel::joinable!(authentication_method_roles -> sites (site_id));
diesel::joinable!(compartments -> content_types (content_type_id));
diesel::joinable!(content -> content_types (content_type_id));
diesel::joinable!(content -> sites (site_id));
diesel::joinable!(content -> workflow_states (workflow_state_id));
diesel::joinable!(content_revisions -> content (content_id));
diesel::joinable!(content_revisions -> sites (site_id));
diesel::joinable!(content_revisions -> users (user_id));
diesel::joinable!(content_revisions -> workflow_states (workflow_state_id));
diesel::joinable!(iam_policies -> sites (site_id));
diesel::joinable!(modules -> sites (site_id));
diesel::joinable!(permissions -> iam_policies (iam_policy_id));
diesel::joinable!(permissions_iam_actions -> iam_actions (iam_action_key));
diesel::joinable!(permissions_iam_actions -> permissions (permission_id));
diesel::joinable!(permissions_iam_conditions -> iam_conditions (iam_condition_key));
diesel::joinable!(permissions_iam_conditions -> permissions (permission_id));
diesel::joinable!(roles -> sites (site_id));
diesel::joinable!(roles_iam_policies -> iam_policies (iam_policy_id));
diesel::joinable!(roles_iam_policies -> roles (role_id));
diesel::joinable!(sites_content_components -> content_components (content_component_id));
diesel::joinable!(sites_content_components -> sites (site_id));
diesel::joinable!(sites_content_types -> content_types (content_type_id));
diesel::joinable!(sites_content_types -> sites (site_id));
diesel::joinable!(sites_languages -> languages (language_id));
diesel::joinable!(sites_languages -> sites (site_id));
diesel::joinable!(sites_storage_repositories -> sites (site_id));
diesel::joinable!(sites_storage_repositories -> storage_repositories (storage_repository_id));
diesel::joinable!(sites_users -> sites (site_id));
diesel::joinable!(sites_users -> users (user_id));
diesel::joinable!(sites_users_roles -> roles (role_id));
diesel::joinable!(sites_users_roles -> sites (site_id));
diesel::joinable!(sites_users_roles -> users (user_id));
diesel::joinable!(users_roles -> roles (role_id));
diesel::joinable!(users_roles -> users (user_id));
diesel::joinable!(workflow_transition_requirements -> workflow_transitions (workflow_transition_id));
diesel::joinable!(workflow_transitions -> workflows (workflow_id));

diesel::allow_tables_to_appear_in_same_query!(
	asset_metadata,
	assets,
	authentication_method_roles,
	authentication_methods,
	compartments,
	content,
	content_components,
	content_fields,
	content_revisions,
	content_types,
	field_config,
	fields,
	iam_actions,
	iam_conditions,
	iam_policies,
	languages,
	modules,
	permissions,
	permissions_iam_actions,
	permissions_iam_conditions,
	roles,
	roles_iam_policies,
	sites,
	sites_content_components,
	sites_content_types,
	sites_languages,
	sites_storage_repositories,
	sites_users,
	sites_users_roles,
	storage_repositories,
	users,
	users_roles,
	workflow_states,
	workflow_transition_requirements,
	workflow_transitions,
	workflows,
);
