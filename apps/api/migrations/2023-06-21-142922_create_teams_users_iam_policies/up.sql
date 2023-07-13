CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE teams_users_iam_policies (
	user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	team_id UUID NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
	iam_policy_id UUID NOT NULL REFERENCES iam_policies (id) ON DELETE CASCADE,
	PRIMARY KEY (team_id, user_id, iam_policy_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX teams_users_iam_policies_user_id_idx ON teams_users_iam_policies (user_id);
CREATE INDEX teams_users_iam_policies_team_id_idx ON teams_users_iam_policies (team_id);
CREATE INDEX teams_users_iam_policies_iam_policy_id_idx ON teams_users_iam_policies (iam_policy_id);
