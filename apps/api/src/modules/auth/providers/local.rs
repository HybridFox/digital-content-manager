use std::borrow::Borrow;
use std::env;

use crate::constants;
use crate::modules::auth::dto::request::LoginUserDTO;
use async_trait::async_trait;
use diesel::PgConnection;
use reqwest::StatusCode;
use crate::errors::{AppError, AppErrorValue};
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
use serde_json::Value;
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
struct LocalConfig {
	client_id: String,
	client_secret: String,
	auth_url: String,
	token_url: String,
	userinfo_url: String,
	scopes: Vec<String>,
}

fn get_client(config: &LocalConfig) -> Result<BasicClient, AppError> {
	let client = BasicClient::new(
		ClientId::new(config.client_id.clone()),
		Some(ClientSecret::new(config.client_secret.clone())),
		AuthUrl::new(config.auth_url.clone())?,
		Some(TokenUrl::new(config.token_url.clone())?),
	)
	.set_redirect_uri(RedirectUrl::new(env::var(
		constants::env_key::FRONTEND_URL,
	)?)?);

	Ok(client)
}

#[derive(Debug, Clone)]
pub struct LocalAuthProvider {
	pub authentication_method: AuthenticationMethod,
}

#[async_trait]
impl AuthProvider for LocalAuthProvider {
	async fn login(
		&self,
		conn: &mut PgConnection,
		body: LoginUserDTO,
	) -> Result<HttpResponse, AppError> {
		let (user, token) = User::signin_local(
			conn,
			body.email.as_ref().ok_or("Email missing")?,
			body.password.as_ref().ok_or("Password missing")?,
			self.authentication_method.id,
		)?;
		let sites = user.get_sites(conn)?;
		let roles = user.get_roles(conn)?;
		let res = response::AuthDTO::from((user, sites, roles, token));
		Ok(HttpResponse::Ok().json(res))
	}

	async fn callback(
		&self,
		_conn: &mut PgConnection,
		_code: String,
	) -> Result<HttpResponse, AppError> {
		Err(AppError::BadRequest(AppErrorValue {
			message: "Callback not implemented for local authentication methods".to_string(),
			status: StatusCode::BAD_REQUEST.as_u16(),
			code: "NOT_IMPLEMENTED".to_owned(),
			..Default::default()
		}))
	}
}
