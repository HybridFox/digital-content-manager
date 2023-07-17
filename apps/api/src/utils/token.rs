use std::env;

use jsonwebtoken::{errors::Error, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::constants;

static ONE_DAY: i64 = 60 * 60 * 24; // in seconds
static ISSUER: &str = "auth.ibs.sh";
static AUDIENCE: &str = "ibs";

pub fn decode(token: &str) -> jsonwebtoken::errors::Result<TokenData<Claims>> {
	let secret = env::var(constants::env_key::JWT_SECRET).expect("JWT Secret should be defined");
	let jwt_secret: &[u8] = secret.as_bytes();
	jsonwebtoken::decode::<Claims>(
		token,
		&DecodingKey::from_secret(jwt_secret),
		&Validation::default(),
	)
}

pub fn generate(user_id: Uuid, now: i64) -> Result<String, Error> {
	let secret = env::var(constants::env_key::JWT_SECRET).expect("JWT Secret should be defined");
	let jwt_secret: &[u8] = secret.as_bytes();
	let claims = Claims::new(user_id, now);
	jsonwebtoken::encode(
		&Header::default(),
		&claims,
		&EncodingKey::from_secret(jwt_secret),
	)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
	aud: String,   // Optional. Audience
	exp: i64, // Required (validate_exp defaults to true in validation). Expiration time (as UTC timestamp)
	iat: i64, // Optional. Issued at (as UTC timestamp)
	iss: String, // Optional. Issuer
	nbf: i64, // Optional. Not Before (as UTC timestamp)
	pub sub: Uuid, // Optional. Subject (whom token refers to)
}

impl Claims {
	pub fn new(user_id: Uuid, now: i64) -> Self {
		Claims {
			iat: now,
			exp: now + ONE_DAY,
			sub: user_id,
			iss: ISSUER.to_owned(),
			aud: AUDIENCE.to_owned(),
			nbf: now,
		}
	}
}
