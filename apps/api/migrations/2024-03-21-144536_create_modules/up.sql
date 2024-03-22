CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE module_types AS ENUM('MODULE', 'API');
ALTER TYPE data_types ADD VALUE IF NOT EXISTS 'BLOCK' AFTER 'REFERENCE';

CREATE TABLE modules (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	type module_types NOT NULL,
	active BOOL NOT NULL DEFAULT TRUE,
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE
);

CREATE INDEX modules_site_id_idx ON modules (site_id);
