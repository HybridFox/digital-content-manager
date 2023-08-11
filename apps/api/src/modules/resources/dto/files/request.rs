use utoipa::ToSchema;
use actix_multipart::form::{tempfile::TempFile, MultipartForm};

#[derive(Debug, MultipartForm, ToSchema)]
pub struct CreateFileDTO {
	#[multipart(rename = "file")]
	pub file: TempFile,
}
