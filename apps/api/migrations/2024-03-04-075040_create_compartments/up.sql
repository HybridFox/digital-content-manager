CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE compartments (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	description TEXT,
	content_type_id UUID NOT NULL REFERENCES content_types (id) ON DELETE CASCADE
);

CREATE INDEX compartments_content_type_id_idx ON compartments (content_type_id);
