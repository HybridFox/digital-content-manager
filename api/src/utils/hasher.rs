pub use bcrypt::verify;
use bcrypt::{hash, BcryptResult, DEFAULT_COST};
use tracing::instrument;

#[instrument(skip_all)]
pub fn hash_password(naive_pw: &str) -> BcryptResult<String> {
	hash(naive_pw, DEFAULT_COST)
}
