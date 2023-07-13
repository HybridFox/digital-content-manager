CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE permissions_iam_conditions (
	iam_condition_key TEXT NOT NULL REFERENCES iam_conditions (key) ON DELETE CASCADE,
	permission_id UUID NOT NULL REFERENCES permissions (id) ON DELETE CASCADE,
	PRIMARY KEY (permission_id, iam_condition_key),
	value JSONB NOT NULL,
	active BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX permissions_iam_conditions_permission_id_idx ON permissions_iam_conditions (permission_id);
CREATE INDEX permissions_iam_conditions_iam_condition_id_idx ON permissions_iam_conditions (iam_condition_key);
