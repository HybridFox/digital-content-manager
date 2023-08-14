use actix_multipart::form::tempfile::TempFile;
use aws_credential_types::Credentials;
use aws_sdk_s3::{Config, config::Region, Client, types::{Delete, ObjectIdentifier}};
use chrono::NaiveDateTime;
use serde_json::Value;

use async_trait::async_trait;
use crate::errors::AppError;
use std::path::Path;
use tokio::{fs, io::AsyncReadExt as _};

use super::lib::{StorageEngine, ResourceItem, ResourceItemKind};

fn clean_path(path: &str) -> &str {
	path.trim_start_matches('/')
}

#[derive(Debug, Clone)]
pub struct S3StorageEngine {
	pub config: Value
}

#[derive(Debug, Clone)]
pub struct FsStorageEngineConfig {
	pub client: aws_sdk_s3::Client,
	pub bucket_name: String,
}

fn get_config(config: &Value) -> FsStorageEngineConfig {
	let s3_endpoint = config["endpoint"].as_str().unwrap().to_string();
	let s3_access_key = config["access_key"].as_str().unwrap().to_string();
	let s3_secret_key = config["secret_key"].as_str().unwrap().to_string();
	let s3_region = config["region"].as_str().unwrap_or("eu-west-3").to_string();
	let bucket_name = config["bucket_name"].as_str().unwrap().to_string();

	let credentials = Credentials::from_keys(s3_access_key, s3_secret_key, None);
	let region = Region::new(s3_region);

	let s3_config = Config::builder()
		.region(region)
		.endpoint_url(s3_endpoint)
		.credentials_provider(credentials)
		.build();

	let client = Client::from_conf(s3_config);

	FsStorageEngineConfig {
		client,
		bucket_name,
	}
}

async fn put_object_from_file(client: aws_sdk_s3::Client, local_path: &str, key: &str, bucket_name: &str) -> Result<usize, AppError> {
	let mut file = fs::File::open(local_path).await.unwrap();

	let size_estimate = file
		.metadata()
		.await
		.map(|md| md.len())
		.unwrap_or(1024)
		.try_into()?;

	let mut contents = Vec::with_capacity(size_estimate);
	file.read_to_end(&mut contents).await.unwrap();

	let _res = client
		.put_object()
		.bucket(bucket_name)
		.key(key)
		.body(aws_sdk_s3::primitives::ByteStream::from(contents))
		.send()
		.await?;

	Ok(size_estimate)
}

#[async_trait]
impl StorageEngine for S3StorageEngine {
	async fn find_all(&self, path: &str) -> Result<(Vec<ResourceItem>, i64), AppError> {
		let config = get_config(&self.config);
		let objects = config
			.client
			.list_objects_v2()
			.delimiter("/")
			.prefix(path)
			.bucket(config.bucket_name)
			.send()
			.await?;

		let mut directories = objects
			.common_prefixes()
			.unwrap_or_default()
			.into_iter()
			.map(|item| {
				Ok(ResourceItem {
					name: item.prefix().unwrap().to_string(),
					kind: ResourceItemKind::DIRECTORY,
					created_at: None,
					updated_at: None,
					mime_type: None,
				})
			})
			.collect::<Result<Vec<ResourceItem>, AppError>>()?;

		let mut resource_items = objects
			.contents()
			.unwrap_or_default()
			.into_iter()
			.map(|item| {
				let name = item.key().unwrap().to_string();

				let guess = mime_guess::from_path(&name);
				let mime_type = if guess.is_empty() {
					None
				} else {
					Some(guess.first().unwrap().to_string())
				};

				Ok(ResourceItem {
					name: name.clone(),
					kind: ResourceItemKind::FILE,
					created_at: NaiveDateTime::from_timestamp_millis(
						item.last_modified()
							.unwrap()
							.to_millis()
							.unwrap(),
					),
					updated_at: NaiveDateTime::from_timestamp_millis(
						item.last_modified()
							.unwrap()
							.to_millis()
							.unwrap(),
					),
					mime_type,
				})
			})
			.collect::<Result<Vec<ResourceItem>, AppError>>()?;
		
		directories.append(&mut resource_items);
		Ok((directories.clone(), directories.len() as i64))
	}

	async fn upload_file(&self, path: &str, file: TempFile) -> Result<(), AppError> {
		let key = Path::new(clean_path(path)).join(file.file_name.unwrap());
		let config = get_config(&self.config);
		put_object_from_file(config.client, file.file.path().to_str().unwrap(), &key.to_str().unwrap(), &config.bucket_name)
			.await?;

		Ok(())
	}

	async fn download_file(&self, path: &str) -> Result<Vec<u8>, AppError> {
		let config = get_config(&self.config);
		let object = config
			.client
			.get_object()
			.bucket(config.bucket_name)
			.key(path)
			.send()
			.await?;

		let stream = object.body;
		let data = stream.collect().await.expect("Error reading data");
		Ok(data.into_bytes().to_vec())
	}

	async fn remove_file(&self, path: &str) -> Result<(), AppError> {
		let config = get_config(&self.config);
		config
			.client
			.delete_object()
			.bucket(config.bucket_name)
			.key(path)
			.send()
			.await?;

		Ok(())
	}

	async fn create_directory(&self, path: &str, name: &str) -> Result<(), AppError> {
		let location = Path::new(".").join(".").join(clean_path(path)).join(name);
		// fs::create_dir_all(&location)?;

		Ok(())
	}

	async fn remove_directory(&self, path: &str) -> Result<(), AppError> {
		let location = Path::new(".").join(".").join(clean_path(path));
		// fs::remove_dir_all(&location)?;

		Ok(())
	}
}
