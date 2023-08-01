CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CREATE TYPE permission_effect AS ENUM('grant', 'deny');
CREATE TABLE permissions (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	iam_policy_id UUID NOT NULL REFERENCES iam_policies (id) ON DELETE CASCADE,
	resources JSONB NOT NULL,
	effect TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX permissions_iam_policy_id_idx ON permissions (iam_policy_id)
