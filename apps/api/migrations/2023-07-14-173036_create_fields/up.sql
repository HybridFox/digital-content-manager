CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE fields (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	slug TEXT NOT NULL,
	parent_id UUID NOT NULL,
	content_component_id UUID NOT NULL
);

CREATE INDEX fields_content_component_id_idx ON fields (content_component_id);
