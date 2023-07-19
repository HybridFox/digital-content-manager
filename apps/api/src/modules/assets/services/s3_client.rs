use crate::{modules::assets::types::upload::UploadedFile, errors::AppError, constants::env_key};
use tokio::{fs, io::AsyncReadExt as _};
use std::env;
use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct Client {
    s3: aws_sdk_s3::Client,
    bucket_name: String,
}

impl Client {
    /// Construct S3 client wrapper.
    pub fn new(config: aws_sdk_s3::Config) -> Client {
        Client {
            s3: aws_sdk_s3::Client::from_conf(config),
            bucket_name: env::var(env_key::S3_BUCKET_NAME).expect("S3_BUCKET_NAME not set"),
        }
    }

    /// Facilitate the upload of file to s3.
    pub async fn upload(
        &self,
        file: &actix_multipart::form::tempfile::TempFile,
        key_prefix: &str,
    ) -> Result<UploadedFile, AppError> {
        let original_filename = file.file_name.as_deref().expect("TODO");
		let extension = original_filename.split(".").last().unwrap_or("");
		let filename = Uuid::new_v4().to_string();
        let key = format!("{key_prefix}/assets/{filename}.{extension}");
        let size_estimate = self
            .put_object_from_file(file.file.path().to_str().unwrap(), &key)
            .await?;

		let guess = mime_guess::from_path(original_filename);
		let mime = guess.first_or(mime_guess::mime::TEXT_PLAIN);
		
        Ok(UploadedFile::new(filename, extension, size_estimate, mime.type_().to_string()))
    }

    /// Real upload of file to S3
    async fn put_object_from_file(&self, local_path: &str, key: &str) -> Result<usize, AppError> {
        let mut file = fs::File::open(local_path).await.unwrap();

        let size_estimate = file
            .metadata()
            .await
            .map(|md| md.len())
            .unwrap_or(1024)
            .try_into()?;

        let mut contents = Vec::with_capacity(size_estimate);
        file.read_to_end(&mut contents).await.unwrap();

        let _res = self
            .s3
            .put_object()
            .bucket(&self.bucket_name)
            .key(key)
            .body(aws_sdk_s3::primitives::ByteStream::from(contents))
            .send()
            .await?;

        Ok(size_estimate)
    }

    /// Attempts to delete object from S3. Returns true if successful.
    pub async fn delete_file(&self, key: &str) -> bool {
        self.s3
            .delete_object()
            .bucket(&self.bucket_name)
            .key(key)
            .send()
            .await
            .is_ok()
    }
}
