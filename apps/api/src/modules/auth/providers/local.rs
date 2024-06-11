use crate::errors::{AppError, AppErrorValue};
use crate::modules::auth::dto::request::LoginUserDTO;
use crate::modules::auth::dto::response;
use crate::modules::auth::services::dynamic_login::AuthProvider;
use crate::modules::authentication_methods::models::authentication_method::AuthenticationMethod;
use crate::modules::users::models::user::User;
use actix_web::HttpResponse;
use async_trait::async_trait;
use diesel::PgConnection;
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct LocalConfig {
	client_id: String,
	client_secret: String,
	auth_url: String,
	token_url: String,
	userinfo_url: String,
	scopes: Vec<String>,
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
