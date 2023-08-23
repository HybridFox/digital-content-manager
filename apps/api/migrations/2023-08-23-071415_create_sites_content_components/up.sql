CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sites_content_components (
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	content_component_id UUID NOT NULL REFERENCES content_components (id) ON DELETE CASCADE,
	PRIMARY KEY (site_id, content_component_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX sites_content_components_site_id_idx ON sites_content_components (site_id);
CREATE INDEX sites_content_components_content_component_id_idx ON sites_content_components (content_component_id);
