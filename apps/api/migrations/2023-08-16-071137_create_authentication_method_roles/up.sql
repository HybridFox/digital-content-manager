CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE authentication_method_roles (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	authentication_method_id UUID NOT NULL REFERENCES authentication_methods (id) ON DELETE CASCADE,
	site_id UUID REFERENCES sites (id) ON DELETE CASCADE,
	role_id UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE
);

CREATE INDEX authentication_method_roles_authentication_method_id_idx ON authentication_method_roles (authentication_method_id);
CREATE INDEX authentication_method_roles_site_id_idx ON authentication_method_roles (site_id);
CREATE INDEX authentication_method_roles_role_id_idx ON authentication_method_roles (role_id);
