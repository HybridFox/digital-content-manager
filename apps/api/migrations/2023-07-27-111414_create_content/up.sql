CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE content (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	slug TEXT NOT NULL,
	workflow_state_id UUID NOT NULL REFERENCES workflow_states (id) ON DELETE CASCADE,
	translation_id UUID NOT NULL,
	language_id UUID NOT NULL,
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	content_type_id UUID NOT NULL REFERENCES content_types (id),
	published BOOLEAN NOT NULL DEFAULT FALSE,
	deleted BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX content_workflow_state_id_idx ON content (workflow_state_id);
CREATE INDEX content_content_type_id_idx ON content (content_type_id);
CREATE INDEX content_site_id_idx ON content (site_id);
