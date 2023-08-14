CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE iam_policies (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	site_id UUID REFERENCES sites (id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX iam_policies_site_id_idx ON iam_policies (site_id)
