CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sites_users_iam_policies (
	user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	iam_policy_id UUID NOT NULL REFERENCES iam_policies (id) ON DELETE CASCADE,
	PRIMARY KEY (site_id, user_id, iam_policy_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX sites_users_iam_policies_user_id_idx ON sites_users_iam_policies (user_id);
CREATE INDEX sites_users_iam_policies_site_id_idx ON sites_users_iam_policies (site_id);
CREATE INDEX sites_users_iam_policies_iam_policy_id_idx ON sites_users_iam_policies (iam_policy_id);
