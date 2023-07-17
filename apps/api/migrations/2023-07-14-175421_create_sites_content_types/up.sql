CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sites_content_types (
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	content_type_id UUID NOT NULL REFERENCES content_types (id) ON DELETE CASCADE,
	PRIMARY KEY (site_id, content_type_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX sites_content_types_site_id_idx ON sites_content_types (site_id);
CREATE INDEX sites_content_types_content_type_id_idx ON sites_content_types (content_type_id);
