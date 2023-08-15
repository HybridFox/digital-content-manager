use actix_web::{dev::ServiceRequest, HttpRequest};
use uuid::Uuid;

use crate::{constants, utils::token};

const TOKEN_IDENTIFIER: &str = "Bearer";

// TODO: dedupe
pub fn get_user_id_from_header(req: &ServiceRequest) -> Result<Uuid, &str> {
	req.headers()
		.get(constants::AUTHORIZATION)
		.ok_or("Cannot find authorization value in headers")
		.and_then(|auth_header| {
			auth_header
				.to_str()
				.map_err(|_err| "Cannot stringify header")
		})
		.and_then(|auth_str| {
			if auth_str.starts_with(TOKEN_IDENTIFIER) {
				Ok(auth_str)
			} else {
				Err("Invalid token convention")
			}
		})
		.map(|auth_str| auth_str[6..auth_str.len()].trim())
		.and_then(|token| token::decode(token).map_err(|_err| "Cannot decode token."))
		.map(|token| token.claims.sub)
}

pub fn get_user_id_from_req(req: &HttpRequest) -> Result<Uuid, &str> {
	req.headers()
		.get(constants::AUTHORIZATION)
		.ok_or("Cannot find authorization value in headers")
		.and_then(|auth_header| {
			auth_header
				.to_str()
				.map_err(|_err| "Cannot stringify header")
		})
		.and_then(|auth_str| {
			if auth_str.starts_with(TOKEN_IDENTIFIER) {
				Ok(auth_str)
			} else {
				Err("Invalid token convention")
			}
		})
		.map(|auth_str| auth_str[6..auth_str.len()].trim())
		.and_then(|token| token::decode(token).map_err(|_err| "Cannot decode token."))
		.map(|token| token.claims.sub)
}
