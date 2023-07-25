CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE field_types AS ENUM('CONTENT-TYPE_FIELD', 'CONTENT-COMPONENT_SUB-FIELD', 'CONTENT-COMPONENT_CONFIG-FIELD');

CREATE TABLE fields (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	slug TEXT NOT NULL,
	description TEXT,
	min INTEGER NOT NULL DEFAULT 1,
	max INTEGER NOT NULL DEFAULT 1,
	hidden BOOLEAN NOT NULL DEFAULT FALSE,
	multi_language BOOLEAN NOT NULL DEFAULT FALSE,
	field_type field_types NOT NULL,
	parent_id UUID NOT NULL,
	content_component_id UUID NOT NULL
);

CREATE INDEX fields_content_component_id_idx ON fields (content_component_id);
