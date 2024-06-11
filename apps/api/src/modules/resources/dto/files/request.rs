use actix_multipart::form::{tempfile::TempFile, MultipartForm};
use utoipa::ToSchema;

#[derive(Debug, MultipartForm, ToSchema)]
pub struct CreateFileDTO {
	#[multipart(rename = "file")]
	pub file: TempFile,
}
