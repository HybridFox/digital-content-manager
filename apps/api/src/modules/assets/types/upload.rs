use serde::Serialize;

#[derive(Debug, Serialize, Clone)]
pub struct UploadedFile {
	pub filename: String,
	pub extension: String,
	pub size: usize,
	pub mime: String,
}

impl UploadedFile {
	/// Construct new uploaded file info container.
	pub fn new(
		filename: impl Into<String>,
		extension: impl Into<String>,
		size: impl Into<usize>,
		mime: impl Into<String>,
	) -> Self {
		Self {
			filename: filename.into(),
			extension: extension.into(),
			size: size.into(),
			mime: mime.into(),
		}
	}
}
