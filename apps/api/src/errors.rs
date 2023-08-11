use actix_web::{http::StatusCode, HttpResponse};
use aws_sdk_s3::error::SdkError;
use bcrypt::BcryptError;
use diesel::r2d2::{Error as R2D2Error, PoolError};
use diesel::result::{DatabaseErrorKind, Error as DieselError};
use jsonwebtoken::errors::{Error as JwtError, ErrorKind as JwtErrorKind};
use oauth2::RequestTokenError;
use serde::Serialize;
use utoipa::ToSchema;
use core::fmt;
use std::convert::From;
use std::env::VarError;
use std::num::TryFromIntError;
use thiserror::Error;
use uuid::{Error as UuidError, Uuid};

#[derive(Debug, Serialize, ToSchema)]
pub struct AppErrorValue {
	pub(crate) message: String,
	pub(crate) status: u16,
	pub(crate) identifier: Uuid,
	pub(crate) code: String,
}

impl Default for AppErrorValue {
	fn default() -> AppErrorValue {
		AppErrorValue {
			message: "".to_owned(),
			status: 500,
			identifier: Uuid::new_v4(),
			code: "ERROR".to_owned(),
		}
	}
}

impl fmt::Display for AppErrorValue {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "{}", self.message)
	}
}

#[derive(Error, Debug)]
pub enum AppError {
	// 401
	#[error("Unauthorized: {:#?}", _0)]
	Unauthorized(AppErrorValue),

	// 403
	#[error("Forbidden: {:#?}", _0)]
	Forbidden(AppErrorValue),

	// 404
	#[error("Not Found: {:#?}", _0)]
	NotFound(AppErrorValue),

	// 422
	#[error("Unprocessable Entity: {:#?}", _0)]
	UnprocessableEntity(AppErrorValue),

	// 422
	#[error("Bad Request: {:#?}", _0)]
	BadRequest(AppErrorValue),

	// 500
	#[error("Internal Server Error: {:#?}", _0)]
	InternalServerError(AppErrorValue),
}

impl actix_web::error::ResponseError for AppError {
	fn error_response(&self) -> HttpResponse {
		println!("ERROR_RESPONSE: {:?}", self);
		match self {
			AppError::Unauthorized(ref msg) => HttpResponse::Unauthorized().json(msg),
			AppError::Forbidden(ref msg) => HttpResponse::Forbidden().json(msg),
			AppError::NotFound(ref msg) => HttpResponse::NotFound().json(msg),
			AppError::BadRequest(ref msg) => HttpResponse::BadRequest().json(msg),
			AppError::UnprocessableEntity(ref msg) => HttpResponse::UnprocessableEntity().json(msg),
			AppError::InternalServerError(ref msg) => HttpResponse::InternalServerError().json(msg),
		}
	}

	fn status_code(&self) -> StatusCode {
		match *self {
			AppError::Unauthorized(_) => StatusCode::UNAUTHORIZED,
			AppError::Forbidden(_) => StatusCode::FORBIDDEN,
			AppError::NotFound(_) => StatusCode::NOT_FOUND,
			AppError::BadRequest(_) => StatusCode::BAD_REQUEST,
			AppError::UnprocessableEntity(_) => StatusCode::UNPROCESSABLE_ENTITY,
			AppError::InternalServerError(_) => StatusCode::INTERNAL_SERVER_ERROR,
		}
	}
}

impl From<PoolError> for AppError {
	fn from(_err: PoolError) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: _err.to_string(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "POOL_ERROR".to_owned(),
			..Default::default()
		})
	}
}

impl From<BcryptError> for AppError {
	fn from(_err: BcryptError) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: _err.to_string(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "BCRYPT_ERROR".to_owned(),
			..Default::default()
		})
	}
}

impl From<R2D2Error> for AppError {
	fn from(_err: R2D2Error) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: _err.to_string(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "R2D2_ERROR".to_owned(),
			..Default::default()
		})
	}
}

impl From<JwtError> for AppError {
	fn from(err: JwtError) -> Self {
		match err.kind() {
			JwtErrorKind::InvalidToken => AppError::Unauthorized(AppErrorValue {
				message: "Invalid token".to_owned(),
				status: StatusCode::UNAUTHORIZED.as_u16(),
				code: "JWT_INVALID_TOKEN".to_owned(),
				..Default::default()
			}),
			JwtErrorKind::InvalidIssuer => AppError::Unauthorized(AppErrorValue {
				message: "Invalid issuer".to_owned(),
				status: StatusCode::UNAUTHORIZED.as_u16(),
				code: "JTW_INVALID_ISSUER".to_owned(),
				..Default::default()
			}),
			_ => AppError::Unauthorized(AppErrorValue {
				message: "Generic token error".to_owned(),
				status: StatusCode::UNAUTHORIZED.as_u16(),
				code: "JTW_ERROR".to_owned(),
				..Default::default()
			}),
		}
	}
}

impl From<DieselError> for AppError {
	fn from(err: DieselError) -> Self {
		match err {
			DieselError::DatabaseError(kind, info) => match kind {
				DatabaseErrorKind::UniqueViolation => {
					AppError::UnprocessableEntity(AppErrorValue {
						message: info.details().unwrap_or_else(|| info.message()).to_string(),
						status: StatusCode::UNPROCESSABLE_ENTITY.as_u16(),
						code: "DB_UNIQUE_VIOLATION".to_owned(),
						..Default::default()
					})
				}
				DatabaseErrorKind::NotNullViolation => {
					AppError::UnprocessableEntity(AppErrorValue {
						message: info.details().unwrap_or_else(|| info.message()).to_string(),
						status: StatusCode::UNPROCESSABLE_ENTITY.as_u16(),
						code: "DB_NOT_NULL_VIOLATION".to_owned(),
						..Default::default()
					})
				}
				DatabaseErrorKind::ForeignKeyViolation => {
					AppError::UnprocessableEntity(AppErrorValue {
						message: info.details().unwrap_or_else(|| info.message()).to_string(),
						status: StatusCode::UNPROCESSABLE_ENTITY.as_u16(),
						code: "DB_FORGEIGN_KEY_VIOLATION".to_owned(),
						..Default::default()
					})
				}
				_ => AppError::InternalServerError(AppErrorValue {
					message: format!("Unimplemented diesel error: {:?}", kind),
					status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
					code: "UNIMPLEMENTED_DIESEL_DATABASE_ERROR".to_owned(),
					..Default::default()
				}),
			},
			DieselError::NotFound => AppError::NotFound(AppErrorValue {
				message: "Resource could not be found".to_owned(),
				status: StatusCode::NOT_FOUND.as_u16(),
				code: "ENTITY_NOT_FOUND".to_owned(),
				..Default::default()
			}),
			_ => AppError::InternalServerError(AppErrorValue {
				message: err.to_string(),
				status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
				code: "UNIMPLEMENTED_DIESEL_ERROR".to_owned(),
				..Default::default()
			}),
		}
	}
}

impl From<UuidError> for AppError {
	fn from(_err: UuidError) -> Self {
		AppError::NotFound(AppErrorValue {
			message: "Error decoding uuid".to_owned(),
			status: StatusCode::NOT_FOUND.as_u16(),
			code: "UUID_ERROR".to_owned(),
			..Default::default()
		})
	}
}

impl From<oauth2::url::ParseError> for AppError {
	fn from(_err: oauth2::url::ParseError) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: "Error parse oauth2 url".to_owned(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "OAUTH2_URL_PARSE_ERROR".to_owned(),
			..Default::default()
		})
	}
}

impl<T> From<SdkError<T>> for AppError {
	fn from(err: SdkError<T>) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: err.to_string(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "S3_ERROR".to_owned(),
			..Default::default()
		})
	}
}

impl From<TryFromIntError> for AppError {
	fn from(_err: TryFromIntError) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: "TryFromIntError".to_owned(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "TRY_FROM_INT_ERROR".to_owned(),
			..Default::default()
		})
	}
}

impl From<std::io::Error> for AppError {
	fn from(err: std::io::Error) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: err.to_string(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "IO_ERROR".to_owned(),
			..Default::default()
		})
	}
}

impl From<std::time::SystemTimeError> for AppError {
	fn from(err: std::time::SystemTimeError) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: err.to_string(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "SYSTEM_TIME_ERROR".to_owned(),
			..Default::default()
		})
	}
}

impl From<VarError> for AppError {
	fn from(_err: VarError) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: _err.to_string(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "MISSING_ENV_VAR".to_owned(),
			..Default::default()
		})
	}
}

impl<RE: std::error::Error, TR: oauth2::ErrorResponse> From<RequestTokenError<RE, TR>>
	for AppError
{
	fn from(_err: RequestTokenError<RE, TR>) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: _err.to_string(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "OAUTH2_REQUEST_ERROR".to_owned(),
			..Default::default()
		})
	}
}

impl From<reqwest::Error> for AppError {
	fn from(_err: reqwest::Error) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: _err.to_string(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "REQUEST_ERROR".to_owned(),
			..Default::default()
		})
	}
}

impl From<serde_json::Error> for AppError {
	fn from(_err: serde_json::Error) -> Self {
		AppError::InternalServerError(AppErrorValue {
			message: _err.to_string(),
			status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
			code: "DESERIALIZE_JSON_ERROR".to_owned(),
			..Default::default()
		})
	}
}
