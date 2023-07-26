CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE field_config_types AS ENUM('TEXT', 'JSON', 'FIELDS');

CREATE TABLE field_config (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	field_id UUID NOT NULL,
	config_key TEXT NOT NULL,
	config_type field_config_types NOT NULL,
	content TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX field_config_field_id_idx ON field_config (field_id);
