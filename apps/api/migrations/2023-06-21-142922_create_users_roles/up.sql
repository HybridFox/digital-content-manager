CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users_roles (
	user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	role_id UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
	PRIMARY KEY (user_id, role_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX users_roles_user_id_idx ON users_roles (user_id);
CREATE INDEX users_roles_role_id_idx ON users_roles (role_id);
