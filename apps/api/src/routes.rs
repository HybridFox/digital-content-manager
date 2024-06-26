use crate::modules;
use actix_web::web;

pub fn api(cfg: &mut web::ServiceConfig) {
	cfg.service(
		web::scope("")
			.service(web::scope("/api/v1")
				.service(web::scope("/sites/{site_id}/content")
					.service(modules::content::controllers::public_content::find_one)
					.service(modules::content::controllers::public_content::find)
				)
				.service(web::scope("/sites/{site_id}/files").service(modules::resources::controllers::public_files::read_file))
			)
			.service(web::scope("/admin-api/v1")
				.service(web::scope("/status").service(modules::core::controllers::status::ping))
				.service(web::scope("/setup").service(modules::setup::controllers::setup::register))
				.service(web::scope("/languages")
					.service(modules::languages::controllers::languages::find_all)
					.service(modules::languages::controllers::languages::find_one)
				)
				.service(web::scope("/content-types")
					.service(modules::content_types::controllers::root_content_types::find_all)
					.service(modules::content_types::controllers::root_content_types::enable)
					.service(modules::content_types::controllers::root_content_types::disable)
				)
				.service(
					web::scope("/auth")
						.service(modules::auth::controllers::auth::me)
						.service(modules::auth::controllers::auth::update)
						.service(
							web::scope("/{auth_id}")
								.service(modules::auth::controllers::dynamic_auth::login)
								.service(modules::auth::controllers::dynamic_auth::callback),
						)
						// .service(
						// 	web::scope("/google")
						// 		.service(modules::auth::controllers::google::login)
						// 		.service(modules::auth::controllers::google::callback),
						// )
				)
				.service(
					web::scope("/sites")
						.service(modules::sites::controllers::sites::create)
						.service(modules::sites::controllers::sites::find_all)
						.service(modules::sites::controllers::sites::find_one)
						.service(modules::sites::controllers::sites::update)
						.service(modules::sites::controllers::sites::remove)
						.service(
							web::scope("/{site_id}/roles")
								.service(modules::roles::controllers::site_roles::create)
								.service(modules::roles::controllers::site_roles::find_all)
								.service(modules::roles::controllers::site_roles::find_one)
								.service(modules::roles::controllers::site_roles::update)
								.service(modules::roles::controllers::site_roles::remove),
						)
						.service(
							web::scope("/{site_id}/users")
								// .service(modules::roles::controllers::roles::create)
								.service(modules::users::controllers::site_users::find_all)
								.service(modules::users::controllers::site_users::find_one)
								.service(modules::users::controllers::site_users::update)
								// .service(modules::roles::controllers::roles::remove),
						)
						.service(
							web::scope("/{site_id}/iam-policies")
								.service(modules::iam_policies::controllers::site_iam_policies::create)
								.service(modules::iam_policies::controllers::site_iam_policies::find_all)
								.service(modules::iam_policies::controllers::site_iam_policies::find_one)
								.service(modules::iam_policies::controllers::site_iam_policies::update)
								.service(modules::iam_policies::controllers::site_iam_policies::remove),
						)
						.service(
							web::scope("/{site_id}/modules")
								.service(modules::modules::controllers::modules::create)
								.service(modules::modules::controllers::modules::find_all)
								.service(modules::modules::controllers::modules::find_one)
								.service(modules::modules::controllers::modules::update)
								.service(modules::modules::controllers::modules::remove),
						)
						.service(
							web::scope("/{site_id}/content-types")
								.service(modules::content_types::controllers::content_types::create)
								.service(modules::content_types::controllers::content_types::find_all)
								.service(modules::content_types::controllers::content_types::find_one)
								.service(modules::content_types::controllers::content_types::update)
								.service(modules::content_types::controllers::content_types::remove)
								.service(
									web::scope("/{content_type_id}/fields")
										.service(modules::content_types::controllers::fields::create)
										.service(modules::content_types::controllers::fields::find_all)
										.service(modules::content_types::controllers::fields::find_one)
										.service(modules::content_types::controllers::fields::update)
										.service(modules::content_types::controllers::fields::remove)
										.service(
											web::scope("/{field_id}/blocks")
												.service(modules::content_types::controllers::blocks::create)
												.service(modules::content_types::controllers::blocks::find_all)
												.service(modules::content_types::controllers::blocks::find_one)
												.service(modules::content_types::controllers::blocks::update)
												.service(modules::content_types::controllers::blocks::remove)
										)
								)
								.service(
									web::scope("/{content_type_id}/compartments")
										.service(modules::content_types::controllers::compartments::create)
										.service(modules::content_types::controllers::compartments::find_all)
										.service(modules::content_types::controllers::compartments::find_one)
										.service(modules::content_types::controllers::compartments::update)
										.service(modules::content_types::controllers::compartments::remove),
								)
								.service(
									web::scope("/{content_type_id}/field-order")
										.service(modules::content_types::controllers::field_order::update_order),
								)
						)
						.service(
							web::scope("/{site_id}/content")
								.service(modules::content::controllers::content::create)
								.service(modules::content::controllers::content::find_all)
								.service(modules::content::controllers::content::find_one)
								.service(modules::content::controllers::content::update)
								.service(modules::content::controllers::content::remove)
								.service(modules::content::controllers::content::default_values)
								.service(
									web::scope("/{content_id}/revisions")
										// .service(modules::content::controllers::content_revisions::create)
										.service(modules::content::controllers::content_revisions::find_all)
										.service(modules::content::controllers::content_revisions::find_one)
										.service(modules::content::controllers::content_revisions::compare)
								)
						)
						.service(
							web::scope("/{site_id}/content-components")
								.service(modules::content_components::controllers::content_components::create)
								.service(modules::content_components::controllers::content_components::find_all)
								.service(modules::content_components::controllers::content_components::find_one)
								.service(modules::content_components::controllers::content_components::update)
								.service(modules::content_components::controllers::content_components::remove)
								.service(
									web::scope("/{content_component_id}/fields")
										.service(modules::content_components::controllers::fields::create)
										.service(modules::content_components::controllers::fields::find_all)
										.service(modules::content_components::controllers::fields::find_one)
										.service(modules::content_components::controllers::fields::update)
										.service(modules::content_components::controllers::fields::remove)
								)
						)
						.service(
							web::scope("/{site_id}/workflows")
								.service(modules::workflows::controllers::workflows::create)
								.service(modules::workflows::controllers::workflows::find_all)
								.service(modules::workflows::controllers::workflows::find_one)
								.service(modules::workflows::controllers::workflows::update)
								.service(modules::workflows::controllers::workflows::remove)
						)
						.service(
							web::scope("/{site_id}/webhooks")
								.service(modules::webhooks::controllers::webhooks::create)
								.service(modules::webhooks::controllers::webhooks::find_all)
								.service(modules::webhooks::controllers::webhooks::find_one)
								.service(modules::webhooks::controllers::webhooks::update)
								.service(modules::webhooks::controllers::webhooks::remove)
						)
						.service(
							web::scope("/{site_id}/workflow-states")
								.service(modules::workflows::controllers::workflow_states::create)
								.service(modules::workflows::controllers::workflow_states::find_all)
								.service(modules::workflows::controllers::workflow_states::find_one)
								.service(modules::workflows::controllers::workflow_states::update)
								.service(modules::workflows::controllers::workflow_states::remove)
						)
						// .service(
						// 	web::scope("/{site_id}/assets")
						// 		.service(modules::assets::controllers::assets::upload)
						// 		.service(modules::assets::controllers::assets::find_all)
						// 		.service(modules::assets::controllers::assets::find_one)
						// )
						.service(
							web::scope("/{site_id}/storage-repositories")
								.service(modules::resources::controllers::storage_repositories::create)
								.service(modules::resources::controllers::storage_repositories::find_all)
								.service(modules::resources::controllers::storage_repositories::find_one)
								.service(modules::resources::controllers::storage_repositories::update)
								.service(modules::resources::controllers::storage_repositories::remove)
								.service(
									web::scope("/{storage_repository_id}/files")
										.service(modules::resources::controllers::files::upload_file)
										.service(modules::resources::controllers::files::read_file)
										.service(modules::resources::controllers::files::remove_file)
								)
								.service(
									web::scope("/{storage_repository_id}/directories")
										.service(modules::resources::controllers::directories::read_directory)
										.service(modules::resources::controllers::directories::create_directory)
										.service(modules::resources::controllers::directories::remove_directory)
								)
						),
				)
				.service(
					web::scope("/iam-actions")
						.service(modules::iam_actions::controllers::iam_actions::find_all)
						.service(modules::iam_actions::controllers::iam_actions::find_one),
				)
				.service(
					web::scope("/iam-conditions")
						.service(modules::iam_conditions::controllers::iam_conditions::find_all)
						.service(modules::iam_conditions::controllers::iam_conditions::find_one),
				)
				.service(
					web::scope("/authentication-methods")
						.service(modules::authentication_methods::controllers::authentication_methods::create)
						.service(modules::authentication_methods::controllers::authentication_methods::find_all)
						.service(modules::authentication_methods::controllers::authentication_methods::find_one)
						.service(modules::authentication_methods::controllers::authentication_methods::update)
						.service(modules::authentication_methods::controllers::authentication_methods::remove)
						.service(
							web::scope("/{authentication_method_id}/role-assignments")
								.service(modules::authentication_methods::controllers::authentication_method_roles::create)
								.service(modules::authentication_methods::controllers::authentication_method_roles::find_all)
								.service(modules::authentication_methods::controllers::authentication_method_roles::find_one)
								.service(modules::authentication_methods::controllers::authentication_method_roles::update)
								.service(modules::authentication_methods::controllers::authentication_method_roles::remove)
						)
				)
				.service(
					web::scope("/users")
						.service(modules::users::controllers::users::create)
						.service(modules::users::controllers::users::find_all)
						.service(modules::users::controllers::users::find_one)
						.service(modules::users::controllers::users::update)
						.service(modules::users::controllers::users::remove)
						.service(modules::users::controllers::users::find_sites)
				)
				.service(
					web::scope("/roles")
						.service(modules::roles::controllers::roles::create)
						.service(modules::roles::controllers::roles::find_all)
						.service(modules::roles::controllers::roles::find_one)
						.service(modules::roles::controllers::roles::update)
						.service(modules::roles::controllers::roles::remove),
				)
				.service(
					web::scope("/iam-policies")
						.service(modules::iam_policies::controllers::iam_policies::create)
						.service(modules::iam_policies::controllers::iam_policies::find_all)
						.service(modules::iam_policies::controllers::iam_policies::find_one)
						.service(modules::iam_policies::controllers::iam_policies::update)
						.service(modules::iam_policies::controllers::iam_policies::remove),
				)
				.service(
					web::scope("/config")
						.service(modules::core::controllers::config::find_all)
						.service(modules::core::controllers::config::update)
				)
			)
	);
}
