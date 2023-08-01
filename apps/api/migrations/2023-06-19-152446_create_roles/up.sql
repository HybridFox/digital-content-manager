CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE roles (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	slug TEXT NOT NULL,
	description TEXT,
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX roles_site_id_idx ON roles (site_id);
