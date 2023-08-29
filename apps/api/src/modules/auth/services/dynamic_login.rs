use crate::{
	errors::{AppError, AppErrorValue},
	modules::{
		authentication_methods::models::authentication_method::AuthenticationMethod,
		auth::{
			providers::{oauth2::OAuth2AuthProvider, local::LocalAuthProvider},
			dto::request::LoginUserDTO,
		},
	},
};
use actix_web::HttpResponse;
use diesel::PgConnection;
use reqwest::StatusCode;
use async_trait::async_trait;
use uuid::Uuid;

#[async_trait]
pub trait AuthProvider {
	async fn login(
		&self,
		conn: &mut PgConnection,
		body: LoginUserDTO,
	) -> Result<HttpResponse, AppError>;
	async fn callback(
		&self,
		conn: &mut PgConnection,
		code: String,
	) -> Result<HttpResponse, AppError>;
}

pub fn get_auth_provider(
	conn: &mut PgConnection,
	authentication_method_id: Uuid,
) -> Result<Box<dyn AuthProvider>, AppError> {
	let authentication_method = AuthenticationMethod::find_one(conn, authentication_method_id)?;

	match authentication_method.kind.as_str() {
		"LOCAL" => Ok(Box::new({
			LocalAuthProvider {
				authentication_method,
			}
		})),
		"OAUTH2" => Ok(Box::new({
			OAuth2AuthProvider {
				authentication_method,
			}
		})),
		_ => Err(AppError::UnprocessableEntity(AppErrorValue {
			message: "Auth provider is not implemented".to_owned(),
			status: StatusCode::UNPROCESSABLE_ENTITY.as_u16(),
			code: "AUTH_PROVIDER_NOT_IMPLEMENTED".to_owned(),
			..Default::default()
		})),
	}
}
