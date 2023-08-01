CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE asset_metadata (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	asset_id UUID NOT NULL REFERENCES assets (id) ON DELETE CASCADE,
	label TEXT NOT NULL,
	value TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX asset_metadata_asset_id_idx ON asset_metadata (asset_id);
