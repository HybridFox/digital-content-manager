CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE webhooks (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	event TEXT NOT NULL,
	url TEXT NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	request_configuration JSONB
);

CREATE INDEX webhooks_site_id_idx ON webhooks (site_id);
