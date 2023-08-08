use actix_multipart::form::tempfile::TempFile;
use chrono::NaiveDateTime;
use serde_json::Value;

use crate::errors::AppError;
use std::{fs, path::Path, time::UNIX_EPOCH};

use super::lib::{StorageEngine, ResourceItem, ResourceItemKind};

#[derive(Debug, Clone)]
pub struct FsStorageEngine {
	pub configuration: Value
}

impl StorageEngine for FsStorageEngine {
	fn find_all(&self, path: &str) -> Result<(Vec<ResourceItem>, i64), AppError> {
		let dir_result = fs::read_dir(Path::new(".").join(self.configuration["base_path"].as_str().unwrap()).join(path))?;

		let resource_items = dir_result
			.into_iter()
			.map(|item| {
				let resource = item?;

				Ok(ResourceItem {
					name: (&resource).clone().file_name().to_str().unwrap().to_owned(),
					kind: if resource.metadata()?.is_dir() {
						ResourceItemKind::DIRECTORY
					} else {
						ResourceItemKind::FILE
					},
					created_at: NaiveDateTime::from_timestamp_millis(
						resource
							.metadata()?
							.created()?
							.duration_since(UNIX_EPOCH)?
							.as_millis()
							.try_into()?,
					),
					updated_at: NaiveDateTime::from_timestamp_millis(
						resource
							.metadata()?
							.modified()?
							.duration_since(UNIX_EPOCH)?
							.as_millis()
							.try_into()?,
					),
				})
			})
			.collect::<Result<Vec<ResourceItem>, AppError>>()?;

		Ok((resource_items.clone(), resource_items.len() as i64))
	}

	fn upload_file(&self, path: &str, file: TempFile) -> Result<(), AppError> {
		let location = Path::new(".").join(self.configuration["base_path"].as_str().unwrap()).join(path).join(file.file_name.unwrap());
		fs::rename(&file.file.path(), &location)?;

		Ok(())
	}

	fn download_file(&self, path: &str) -> Result<Vec<u8>, AppError> {
		let location = Path::new(".").join(self.configuration["base_path"].as_str().unwrap()).join(path);
		let result = fs::read(&location)?;

		Ok(result)
	}

	fn remove_file(&self, path: &str) -> Result<(), AppError> {
		let location = Path::new(".").join(self.configuration["base_path"].as_str().unwrap()).join(path);
		fs::remove_file(&location)?;

		Ok(())
	}

	fn create_directory(&self, path: &str, name: &str) -> Result<(), AppError> {
		let location = Path::new(".").join(self.configuration["base_path"].as_str().unwrap()).join(path).join(name);
		fs::create_dir_all(&location)?;

		Ok(())
	}

	fn remove_directory(&self, path: &str) -> Result<(), AppError> {
		let location = Path::new(".").join(self.configuration["base_path"].as_str().unwrap()).join(path);
		fs::remove_dir_all(&location)?;

		Ok(())
	}
}
