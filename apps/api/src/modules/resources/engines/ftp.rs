use actix_multipart::form::tempfile::TempFile;

use chrono::DateTime;
use serde_json::Value;

use crate::errors::AppError;
use async_trait::async_trait;
use std::fs;
use std::path::Path;
use std::{str::FromStr, time::UNIX_EPOCH};
use suppaftp::{list::File, NativeTlsFtpStream};

use path_slash::PathExt as _;

use super::lib::{ResourceItem, ResourceItemKind, StorageEngine};

fn clean_path(path: &str) -> &str {
	path.trim_start_matches('/')
}

#[derive(Debug, Clone)]
pub struct FtpStorageEngine {
	pub config: Value,
}

#[derive(Debug)]
pub struct FtpStorageEngineConfig {
	pub client: NativeTlsFtpStream,
}

fn get_config(config: &Value) -> Result<FtpStorageEngineConfig, AppError> {
	let ftp_server = config["server"].as_str().unwrap().to_string();
	let ftp_username = config["ftp_username"].as_str().unwrap().to_string();
	let ftp_password = config["ftp_password"].as_str().unwrap().to_string();

	let mut client = NativeTlsFtpStream::connect(&ftp_server)?;
	let _ = client.login(ftp_username, ftp_password)?;
	// let client = client
	// 	.into_secure(
	// 		NativeTlsConnector::from(TlsConnector::new().unwrap()),
	// 		&ftp_server,
	// 	)?;

	Ok(FtpStorageEngineConfig { client })
}

#[async_trait]
impl StorageEngine for FtpStorageEngine {
	async fn find_all(&self, path: &str) -> Result<(Vec<ResourceItem>, i64), AppError> {
		let mut config = get_config(&self.config)?;
		let objects: Vec<String> = config.client.list(Some(path))?;

		let resource_items = objects
			.into_iter()
			.map(|path| {
				let resource: File = File::from_str(&path).unwrap();
				let name = (&resource).name().to_owned();

				let guess = mime_guess::from_path(&name);
				let mime_type = if guess.is_empty() {
					None
				} else {
					Some(guess.first().unwrap().to_string())
				};

				Ok(ResourceItem {
					name,
					kind: if resource.is_directory() {
						ResourceItemKind::DIRECTORY
					} else {
						ResourceItemKind::FILE
					},
					created_at: DateTime::from_timestamp_millis(
						resource
							.modified()
							.duration_since(UNIX_EPOCH)?
							.as_millis()
							.try_into()?,
					),
					updated_at: DateTime::from_timestamp_millis(
						resource
							.modified()
							.duration_since(UNIX_EPOCH)?
							.as_millis()
							.try_into()?,
					),
					mime_type,
				})
			})
			.collect::<Result<Vec<ResourceItem>, AppError>>()?;

		Ok((resource_items.clone(), resource_items.len() as i64))
	}

	async fn upload_file(&self, path: &str, local_file: TempFile) -> Result<(), AppError> {
		let key = Path::new(clean_path(path)).join(local_file.file_name.unwrap());
		let mut config = get_config(&self.config)?;
		let mut file = fs::File::open(local_file.file.path().to_str().unwrap())?;

		let _ = config.client.put_file(key.to_slash().unwrap(), &mut file)?;

		Ok(())
	}

	async fn download_file(&self, path: &str) -> Result<Vec<u8>, AppError> {
		let mut config = get_config(&self.config)?;
		let object = config.client.retr_as_buffer(path)?;

		Ok(object.into_inner())
	}

	async fn remove_file(&self, path: &str) -> Result<(), AppError> {
		let mut config = get_config(&self.config)?;
		config.client.rm(path)?;

		Ok(())
	}

	async fn create_directory(&self, path: &str, name: &str) -> Result<(), AppError> {
		let key = Path::new(clean_path(path)).join(name);
		let mut config = get_config(&self.config)?;
		config.client.mkdir(key.to_slash().unwrap())?;

		Ok(())
	}

	async fn remove_directory(&self, path: &str) -> Result<(), AppError> {
		let mut config = get_config(&self.config)?;
		config.client.rmdir(path)?;

		Ok(())
	}
}
