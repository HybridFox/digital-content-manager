CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE roles_iam_policies (
	iam_policy_id UUID NOT NULL REFERENCES iam_policies (id) ON DELETE CASCADE,
	role_id UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
	PRIMARY KEY (role_id, iam_policy_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX roles_iam_policies_iam_policy_id_idx ON roles_iam_policies (iam_policy_id);
CREATE INDEX roles_iam_policies_role_id_idx ON roles_iam_policies (role_id);
