CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE content (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	slug TEXT NOT NULL,
	workflow_state_id UUID NOT NULL REFERENCES workflow_states (id) ON DELETE CASCADE,
	translation_id UUID NOT NULL,
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	published BOOLEAN NOT NULL DEFAULT FALSE,
	deleted BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX content_workflow_state_id_idx ON content (workflow_state_id);
CREATE INDEX content_site_id_idx ON content (site_id);
