use crate::{
	errors::{AppError, AppErrorValue},
	modules::resources::models::storage_repository::StorageRepository,
};
use actix_multipart::form::tempfile::TempFile;
use chrono::NaiveDateTime;
use diesel::PgConnection;
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use async_trait::async_trait;
use uuid::Uuid;

use super::{fs::FsStorageEngine, s3::S3StorageEngine, ftp::FtpStorageEngine};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum ResourceItemKind {
	FILE,
	DIRECTORY,
}

#[derive(Debug, Clone)]
pub struct ResourceItem {
	pub name: String,
	pub kind: ResourceItemKind,
	pub mime_type: Option<String>,
	pub created_at: Option<NaiveDateTime>,
	pub updated_at: Option<NaiveDateTime>,
}

#[async_trait]
pub trait StorageEngine {
	// fn new(configuration: Value) -> Self;
	async fn find_all(&self, path: &str) -> Result<(Vec<ResourceItem>, i64), AppError>;

	async fn upload_file(&self, path: &str, file: TempFile) -> Result<(), AppError>;
	async fn download_file(&self, path: &str) -> Result<Vec<u8>, AppError>;
	async fn remove_file(&self, path: &str) -> Result<(), AppError>;

	async fn create_directory(&self, path: &str, name: &str) -> Result<(), AppError>;
	async fn remove_directory(&self, path: &str) -> Result<(), AppError>;
}

pub fn get_storage_engine(
	conn: &mut PgConnection,
	storage_repository_id: Uuid,
) -> Result<Box<dyn StorageEngine>, AppError> {
	let storage_repository = StorageRepository::find_one(conn, storage_repository_id)?;

	match storage_repository.kind.as_str() {
		"LOCAL_FS" => Ok(Box::new({
			FsStorageEngine {
				config: storage_repository.configuration,
			}
		})),
		"S3_BUCKET" => Ok(Box::new({
			S3StorageEngine {
				config: storage_repository.configuration,
			}
		})),
		"FTP" => Ok(Box::new({
			FtpStorageEngine {
				config: storage_repository.configuration,
			}
		})),
		_ => Err(AppError::UnprocessableEntity(AppErrorValue {
			message: "Storage engine is not implemented".to_owned(),
			status: StatusCode::UNPROCESSABLE_ENTITY.as_u16(),
			code: "STORAGE_ENGINE_NOT_IMPLEMENTED".to_owned(),
			..Default::default()
		})),
	}
}
