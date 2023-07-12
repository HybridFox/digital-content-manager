CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE teams_users (
	user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	team_id UUID NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
	role_id UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
	PRIMARY KEY (team_id, user_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX teams_users_user_id_idx ON teams_users (user_id);
CREATE INDEX teams_users_team_id_idx ON teams_users (team_id);
CREATE INDEX teams_users_role_id_idx ON teams_users (role_id);
