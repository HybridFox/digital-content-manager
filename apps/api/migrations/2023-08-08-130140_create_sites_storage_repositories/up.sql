CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sites_storage_repositories (
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	storage_repository_id UUID NOT NULL REFERENCES storage_repositories (id) ON DELETE CASCADE,
	PRIMARY KEY (site_id, storage_repository_id)
);

CREATE INDEX sites_storage_repositories_site_id_idx ON sites_storage_repositories (site_id);
CREATE INDEX sites_storage_repositories_storage_repository_id_idx ON sites_storage_repositories (storage_repository_id);
