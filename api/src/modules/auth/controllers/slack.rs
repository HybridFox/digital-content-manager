use std::borrow::Borrow;
use std::env;

use crate::constants::{env_key, self};
use crate::errors::AppError;
use crate::modules::auth::dto::response;
use crate::modules::auth::models::user::User;
use crate::modules::auth::services::register::register_user;
use crate::modules::core::middleware::state::AppState;
use crate::utils::string::generate_random_string;
use actix_web::web::Redirect;
use actix_web::{get, web, HttpResponse};
use oauth2::basic::{
	BasicTokenType, BasicErrorResponse, BasicTokenIntrospectionResponse,
	BasicRevocationErrorResponse,
};
use oauth2::{
	CsrfToken, Scope, AuthorizationCode, TokenResponse, AccessToken, RefreshToken,
	ExtraTokenFields, EmptyExtraTokenFields, Client, StandardRevocableToken, TokenType, ClientId,
	ClientSecret, AuthUrl, TokenUrl, RedirectUrl,
};
use oauth2::reqwest::async_http_client;
use serde::{Deserialize, Serialize};
use tracing::instrument;
use utoipa::IntoParams;
use std::time::Duration;

type SpecialTokenResponse = SlackTokenResponse<EmptyExtraTokenFields>;
type SlackClient = Client<
	BasicErrorResponse,
	SpecialTokenResponse,
	BasicTokenType,
	BasicTokenIntrospectionResponse,
	StandardRevocableToken,
	BasicRevocationErrorResponse,
>;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct SlackAuthedUserResponse {
	access_token: AccessToken,
	token_type: BasicTokenType,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct SlackTokenResponse<EF: ExtraTokenFields> {
	authed_user: SlackAuthedUserResponse,

	#[serde(bound = "EF: ExtraTokenFields")]
	#[serde(flatten)]
	extra_fields: EF,
}

impl<EF> TokenResponse<BasicTokenType> for SlackTokenResponse<EF>
where
	EF: ExtraTokenFields,
	BasicTokenType: TokenType,
{
	///
	/// REQUIRED. The access token issued by the authorization server.
	///
	fn access_token(&self) -> &AccessToken {
		&self.authed_user.access_token
	}
	///
	/// REQUIRED. The type of the token issued as described in
	/// [Section 7.1](https://tools.ietf.org/html/rfc6749#section-7.1).
	/// Value is case insensitive and deserialized to the generic `TokenType` parameter.
	/// But in this particular case as the service is non compliant, it has a default value
	///
	fn token_type(&self) -> &BasicTokenType {
		&self.authed_user.token_type
	}

	fn expires_in(&self) -> Option<Duration> {
		None
	}

	fn refresh_token(&self) -> Option<&RefreshToken> {
		None
	}

	fn scopes(&self) -> Option<&Vec<Scope>> {
		None
	}
}

fn get_client() -> Result<SlackClient, AppError> {
	let client = SlackClient::new(
		ClientId::new(env::var(constants::env_key::SLACK_OAUTH2_CLIENT_ID)?),
		Some(ClientSecret::new(env::var(
			constants::env_key::SLACK_OAUTH2_CLIENT_SECRET,
		)?)),
		AuthUrl::new(env::var(constants::env_key::SLACK_OAUTH2_AUTH_URL)?)?,
		Some(TokenUrl::new(env::var(
			constants::env_key::SLACK_OAUTH2_TOKEN_URL,
		)?)?),
	)
	.set_redirect_uri(RedirectUrl::new(env::var(
		constants::env_key::SLACK_OAUTH2_REDIRECT_URL,
	)?)?);

	Ok(client)
}

#[derive(Deserialize, IntoParams, Debug)]
pub struct CallbackQueryParams {
	code: String,
}

#[derive(Deserialize, IntoParams, Debug)]
pub struct UserInfoUserResponse {
	name: String,
	email: String,
	image_512: String,
}

#[derive(Deserialize, IntoParams, Debug)]
pub struct UserInfoResponse {
	user: UserInfoUserResponse,
}

#[utoipa::path(
	context_path = "/api/v1/auth/slack",
	responses(
		(status = 302),
	)
)]
#[get("/login")]
pub async fn login() -> Result<Redirect, AppError> {
	// TODO: Verify CSRF
	let (auth_url, _csrf_token) = get_client()?
		.authorize_url(CsrfToken::new_random)
		// .add_scope(Scope::new("identity.basic".to_string()))
		.add_extra_param(
			"user_scope",
			"identity.basic,identity.email,identity.avatar",
		)
		.url();

	Ok(Redirect::to(auth_url.to_string()))
}

#[instrument]
async fn get_userinfo(access_token: &String) -> Result<UserInfoResponse, AppError> {
	let client = reqwest::Client::new();
	let userinfo_result = client
		.get(env::var(env_key::SLACK_OAUTH2_USERINFO_URL)?)
		.header("Authorization", format!("Bearer {}", access_token))
		.send()
		.await?
		.text()
		.await?;

	let result: UserInfoResponse = serde_json::from_str(userinfo_result.borrow())?;
	Ok(result)
}

#[instrument]
async fn get_token(code: String) -> Result<SlackTokenResponse<EmptyExtraTokenFields>, AppError> {
	Ok(get_client()?
		.exchange_code(AuthorizationCode::new(code))
		.request_async(async_http_client)
		.await?)
}

#[instrument]
#[utoipa::path(
	context_path = "/api/v1/auth/slack",
	responses(
		(status = 200, body = UserDTO),
		(status = 401, body = AppErrorValue, description = "Unauthorized")
	)
)]
#[get("/callback")]
pub async fn callback(
	state: web::Data<AppState>,
	params: web::Query<CallbackQueryParams>,
) -> Result<HttpResponse, AppError> {
	let conn = &mut state.get_conn()?;

	let token_result = get_token(params.code.to_string()).await?;
	let userinfo = get_userinfo(token_result.access_token().secret()).await?;

	// Try to find existing user
	let existing_user = User::signin_social(conn, &userinfo.user.email, "slack");

	match existing_user {
		Ok((user, token)) => {
			let res = response::UserDTO::from((user, token));
			Ok(HttpResponse::Ok().json(res))
		}
		Err(_) => {
			let (user, token) = register_user(
				conn,
				&userinfo.user.email,
				&userinfo.user.name,
				&generate_random_string(20),
				Some(&userinfo.user.image_512),
				Some("slack"),
			)
			.await?;

			let res = response::UserDTO::from((user, token));
			Ok(HttpResponse::Ok().json(res))
		}
	}
}
