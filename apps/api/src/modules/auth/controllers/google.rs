use std::borrow::Borrow;
use std::env;

use crate::constants::{env_key, self};
use crate::errors::AppError;
use crate::modules::auth::dto::response;
use crate::modules::users::models::user::User;
use crate::modules::auth::services::register::register_user;
use crate::modules::core::middleware::state::AppState;
use crate::utils::string::generate_random_string;
use actix_web::web::Redirect;
use actix_web::{get, web, HttpResponse};
use oauth2::basic::BasicClient;
use oauth2::{
	CsrfToken, Scope, AuthorizationCode, ClientId, ClientSecret, AuthUrl, TokenUrl, RedirectUrl,
	TokenResponse,
};
use oauth2::reqwest::async_http_client;
use serde::Deserialize;
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

fn get_client() -> Result<BasicClient, AppError> {
	let client = BasicClient::new(
		ClientId::new(env::var(constants::env_key::GOOGLE_OAUTH2_CLIENT_ID)?),
		Some(ClientSecret::new(env::var(
			constants::env_key::GOOGLE_OAUTH2_CLIENT_SECRET,
		)?)),
		AuthUrl::new(env::var(constants::env_key::GOOGLE_OAUTH2_AUTH_URL)?)?,
		Some(TokenUrl::new(env::var(
			constants::env_key::GOOGLE_OAUTH2_TOKEN_URL,
		)?)?),
	)
	.set_redirect_uri(RedirectUrl::new(env::var(
		constants::env_key::GOOGLE_OAUTH2_REDIRECT_URL,
	)?)?);

	Ok(client)
}

#[utoipa::path(
	context_path = "/api/v1/auth/google",
	responses(
		(status = 302),
	)
)]
#[get("/login")]
pub async fn login(_state: web::Data<AppState>) -> Result<Redirect, AppError> {
	// TODO: Verify CSRF
	let (auth_url, _csrf_token) = get_client()?
		.authorize_url(CsrfToken::new_random)
		// Set the desired scopes.
		.add_scope(Scope::new("openid".to_string()))
		.add_scope(Scope::new(
			"https://www.googleapis.com/auth/userinfo.email".to_string(),
		))
		.add_scope(Scope::new(
			"https://www.googleapis.com/auth/userinfo.profile".to_string(),
		))
		.url();

	// let conn = &mut state.get_conn()?;
	// let (user, token) = User::signin(conn, &form.email, &form.password)?;
	// let res = response::AuthDTO::from((user, token));
	Ok(Redirect::to(auth_url.to_string()))
}

#[utoipa::path(
	context_path = "/api/v1/auth/google",
	responses(
		(status = 200, body = AuthDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	)
)]
#[get("/callback")]
pub async fn callback(
	state: web::Data<AppState>,
	params: web::Query<CallbackQueryParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;

	let token_result = get_client()?
		.exchange_code(AuthorizationCode::new(params.code.to_string()))
		.request_async(async_http_client)
		.await?;

	let client = reqwest::Client::new();
	let userinfo_result = client
		.get(env::var(env_key::GOOGLE_OAUTH2_USERINFO_URL)?)
		.query(&[("access_token", token_result.access_token().secret())])
		.send()
		.await?
		.text()
		.await?;
	let userinfo: UserInfoResponse = serde_json::from_str(userinfo_result.borrow())?;

	// Try to find existing user
	let existing_user = User::signin_social(conn, &userinfo.email, "google");

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
				Some("google"),
			)
			.await?;

			let sites = user.get_sites(conn)?;
			let roles = user.get_roles(conn)?;
			let res = response::AuthDTO::from((user, sites, roles, token));
			Ok(HttpResponse::Ok().json(res))
		}
	}
}
