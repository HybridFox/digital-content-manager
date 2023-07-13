CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE permissions_iam_actions (
	iam_action_key TEXT NOT NULL REFERENCES iam_actions (key) ON DELETE CASCADE,
	permission_id UUID NOT NULL REFERENCES permissions (id) ON DELETE CASCADE,
	PRIMARY KEY (permission_id, iam_action_key),
	active BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX permissions_iam_actions_iam_action_id_idx ON permissions_iam_actions (iam_action_key);
CREATE INDEX permissions_iam_actions_permission_id_idx ON permissions_iam_actions (permission_id);
