CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS modules;
DROP TYPE IF EXISTS module_types;

CREATE TABLE modules (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	entry_url TEXT NOT NULL,
	active BOOL NOT NULL DEFAULT TRUE,
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE
);

CREATE INDEX modules_site_id_idx ON modules (site_id);
