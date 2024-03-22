use actix_multipart::form::tempfile::TempFile;
use chrono::DateTime;
use serde_json::Value;
use async_trait::async_trait;
use crate::errors::AppError;
use std::{fs, path::Path, time::UNIX_EPOCH, env::current_dir};

use super::lib::{StorageEngine, ResourceItem, ResourceItemKind};

#[derive(Debug, Clone)]
pub struct FsStorageEngine {
	pub config: Value,
}

#[derive(Debug, Clone)]
pub struct FsStorageEngineConfig {
	pub base_path: String,
}

fn clean_path(path: &str) -> &str {
	path.trim_start_matches('/')
}

fn get_config(config: &Value) -> FsStorageEngineConfig {
	FsStorageEngineConfig {
		base_path: config["base_path"].as_str().unwrap().to_string(),
	}
}

#[async_trait]
impl StorageEngine for FsStorageEngine {
	async fn find_all(&self, path: &str) -> Result<(Vec<ResourceItem>, i64), AppError> {
		let config = get_config(&self.config);
		let current_dir = current_dir()?;
		let location = Path::new(&current_dir)
			.join(config.base_path)
			.join(clean_path(path));
		let dir_result = fs::read_dir(&location)?;

		let resource_items = dir_result
			.into_iter()
			.map(|item| {
				let resource = item?;
				let name = (&resource).file_name().to_str().unwrap().to_owned();

				let guess = mime_guess::from_path(&name);
				let mime_type = if guess.is_empty() {
					None
				} else {
					Some(guess.first().unwrap().to_string())
				};

				Ok(ResourceItem {
					name,
					kind: if resource.metadata()?.is_dir() {
						ResourceItemKind::DIRECTORY
					} else {
						ResourceItemKind::FILE
					},
					created_at: DateTime::from_timestamp_millis(
						resource
							.metadata()?
							.created()?
							.duration_since(UNIX_EPOCH)?
							.as_millis()
							.try_into()?,
					),
					updated_at: DateTime::from_timestamp_millis(
						resource
							.metadata()?
							.modified()?
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

	async fn upload_file(&self, path: &str, file: TempFile) -> Result<(), AppError> {
		let config = get_config(&self.config);
		let location = Path::new(".")
			.join(config.base_path)
			.join(clean_path(path))
			.join(file.file_name.unwrap());
		fs::copy(&file.file.path(), &location)?;
		fs::remove_file(&location)?;

		Ok(())
	}

	async fn download_file(&self, path: &str) -> Result<Vec<u8>, AppError> {
		let config = get_config(&self.config);
		let location = Path::new(".").join(config.base_path).join(clean_path(path));
		let result = fs::read(&location)?;

		Ok(result)
	}

	async fn remove_file(&self, path: &str) -> Result<(), AppError> {
		let config = get_config(&self.config);
		let location = Path::new(".").join(config.base_path).join(clean_path(path));
		fs::remove_file(&location)?;

		Ok(())
	}

	async fn create_directory(&self, path: &str, name: &str) -> Result<(), AppError> {
		let config = get_config(&self.config);
		let location = Path::new(".")
			.join(config.base_path)
			.join(clean_path(path))
			.join(name);
		fs::create_dir_all(&location)?;

		Ok(())
	}

	async fn remove_directory(&self, path: &str) -> Result<(), AppError> {
		let config = get_config(&self.config);
		let location = Path::new(".").join(config.base_path).join(clean_path(path));
		fs::remove_dir_all(&location)?;

		Ok(())
	}
}
