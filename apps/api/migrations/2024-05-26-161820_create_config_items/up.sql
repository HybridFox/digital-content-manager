CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE config_items (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	key TEXT NOT NULL,
	module_name TEXT,
	site_id UUID REFERENCES sites (id) ON DELETE CASCADE,
	value JSONB
);

CREATE INDEX config_items_site_id_idx ON config_items (site_id);
