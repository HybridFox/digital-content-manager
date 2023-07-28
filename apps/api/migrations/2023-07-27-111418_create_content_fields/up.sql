CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE content_fields (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	value JSONB,
	parent_id UUID NOT NULL
);
