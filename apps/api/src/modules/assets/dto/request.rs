use utoipa::ToSchema;
use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};

#[derive(Debug, MultipartForm, ToSchema)]
pub struct CreateAssetDTO {
	pub name: Text<String>,
	pub description: Text<String>,

	#[multipart(rename = "file")]
	pub file: TempFile,
}
