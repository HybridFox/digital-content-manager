use std::borrow::Borrow;
use std::env;

use crate::constants;
use crate::modules::auth::dto::request::LoginUserDTO;
use async_trait::async_trait;
use diesel::PgConnection;
use crate::errors::AppError;
use crate::modules::auth::dto::response;
use crate::modules::auth::services::dynamic_login::AuthProvider;
use crate::modules::authentication_methods::models::authentication_method::AuthenticationMethod;
use crate::modules::users::models::user::User;
use crate::modules::auth::services::register::register_user;
use crate::utils::string::generate_random_string;
use actix_web::HttpResponse;
use oauth2::basic::BasicClient;
use oauth2::{
	CsrfToken, Scope, AuthorizationCode, ClientId, ClientSecret, AuthUrl, TokenUrl, RedirectUrl,
	TokenResponse,
};
use oauth2::reqwest::async_http_client;
use serde::{Serialize, Deserialize};
use serde_json::{Value, json};
use utoipa::IntoParams;

#[derive(Deserialize, IntoParams)]
pub struct CallbackQueryParams {
	code: String,
}

#[derive(Deserialize, IntoParams, Debug)]
pub struct UserInfoResponse {
	email: String,
	name: String,
	picture: String,
}

#[derive(Serialize, Deserialize)]
struct OAuth2Config {
	client_id: String,
	client_secret: String,
	auth_url: String,
	token_url: String,
	userinfo_url: String,
	scopes: Vec<String>,
}

fn get_client(
	config: &OAuth2Config,
	authentication_method: &AuthenticationMethod,
) -> Result<BasicClient, AppError> {
	let frontend_url = env::var(constants::env_key::FRONTEND_URL)?;
	let client = BasicClient::new(
		ClientId::new(config.client_id.clone()),
		Some(ClientSecret::new(config.client_secret.clone())),
		AuthUrl::new(config.auth_url.clone())?,
		Some(TokenUrl::new(config.token_url.clone())?),
	)
	.set_redirect_uri(RedirectUrl::new(format!(
		"{}/auth/{}/callback", frontend_url, authentication_method.id
	))?);

	Ok(client)
}

#[derive(Debug, Clone)]
pub struct OAuth2AuthProvider {
	pub authentication_method: AuthenticationMethod,
}

#[async_trait]
impl AuthProvider for OAuth2AuthProvider {
	async fn login(
		&self,
		_conn: &mut PgConnection,
		_body: LoginUserDTO,
	) -> Result<HttpResponse, AppError> {
		let config: OAuth2Config = serde_json::from_str(
			&self
				.authentication_method
				.configuration
				.as_ref()
				.unwrap_or(&Value::Null)
				.to_string(),
		)?;

		// TODO: Verify CSRF
		let oauth2_client = get_client(&config, &self.authentication_method)?;

		let scopes = config
			.scopes
			.into_iter()
			.map(|scope| Scope::new(scope))
			.collect::<Vec<Scope>>();
		let (auth_url, _csrf_token) = oauth2_client
			.authorize_url(CsrfToken::new_random)
			.add_scopes(scopes)
			.url();

		Ok(HttpResponse::Ok().json(json!({ "redirect": auth_url.as_str() })))
	}

	async fn callback(
		&self,
		conn: &mut PgConnection,
		code: String,
	) -> Result<HttpResponse, AppError> {
		let config: OAuth2Config = serde_json::from_str(
			&self
				.authentication_method
				.configuration
				.as_ref()
				.unwrap_or(&Value::Null)
				.to_string(),
		)?;

		let token_result = get_client(&config, &self.authentication_method)?
			.exchange_code(AuthorizationCode::new(code))
			.request_async(async_http_client)
			.await?;

		let client = reqwest::Client::new();
		let userinfo_result = client
			.get(config.userinfo_url)
			.query(&[("access_token", token_result.access_token().secret())])
			.send()
			.await?
			.text()
			.await?;
		let userinfo: UserInfoResponse = serde_json::from_str(userinfo_result.borrow())?;

		// Try to find existing user
		let existing_user =
			User::signin_social(conn, &userinfo.email, self.authentication_method.id);

		match existing_user {
			Ok((user, token)) => {
				let sites = user.get_sites(conn)?;
				let roles = user.get_roles(conn)?;
				let res = response::AuthDTO::from((user, sites, roles, token));
				Ok(HttpResponse::Ok().json(res))
			}
			Err(_) => {
				let (user, token) = register_user(
					conn,
					&userinfo.email,
					&userinfo.name,
					&generate_random_string(20),
					Some(&userinfo.picture),
					Some(self.authentication_method.id),
				)
				.await?;

				let sites = user.get_sites(conn)?;
				let roles = user.get_roles(conn)?;
				let res = response::AuthDTO::from((user, sites, roles, token));
				Ok(HttpResponse::Ok().json(res))
			}
		}
	}
}
