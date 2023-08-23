CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE content_revisions (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	workflow_state_id UUID NOT NULL REFERENCES workflow_states (id) ON DELETE CASCADE,
	revision_translation_id UUID NOT NULL,
	content_id UUID NOT NULL REFERENCES content (id) ON DELETE CASCADE,
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	published BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX content_revisions_workflow_state_id_idx ON content_revisions (workflow_state_id);
CREATE INDEX content_revisions_content_id_idx ON content_revisions (content_id);
CREATE INDEX content_revisions_site_id_idx ON content_revisions (site_id);
