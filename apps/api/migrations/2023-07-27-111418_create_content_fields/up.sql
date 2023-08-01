CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE content_fields (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	value JSONB,
	parent_id UUID,
	source_id UUID NOT NULL, -- Either content id or translation id
	content_component_id UUID,
	sequence_number INTEGER,
	data_type data_types NOT NULL
);
