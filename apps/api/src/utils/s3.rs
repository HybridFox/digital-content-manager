use crate::constants::env_key;
use crate::modules::assets::services::s3_client::Client;
use aws_sdk_s3::Config;
use aws_sdk_s3::config::Region;
use aws_credential_types::Credentials;
use std::env;

pub fn get_client() -> Client {
	let s3_endpoint = env::var(env_key::S3_ENDPOINT).expect("S3_ENDPOINT must be set");
	let s3_access_key = env::var(env_key::S3_ACCESS_KEY).expect("S3_ACCESS_KEY must be set");
	let s3_secret_key = env::var(env_key::S3_SECRET_KEY).expect("S3_SECRET_KEY must be set");

	let credentials = Credentials::from_keys(
		s3_access_key,
		s3_secret_key,
		None
	);

    let region = Region::new("eu-west-3");
	let s3_config = Config::builder()
        .region(region)
        .endpoint_url(s3_endpoint)
        .credentials_provider(credentials)
        .build();

	Client::new(s3_config)
}
