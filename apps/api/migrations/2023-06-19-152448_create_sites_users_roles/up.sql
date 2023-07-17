CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sites_users_roles (
	user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	role_id UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
	PRIMARY KEY (site_id, user_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX sites_users_roles_user_id_idx ON sites_users_roles (user_id);
CREATE INDEX sites_users_roles_site_id_idx ON sites_users_roles (site_id);
CREATE INDEX sites_users_roles_role_id_idx ON sites_users_roles (role_id);
