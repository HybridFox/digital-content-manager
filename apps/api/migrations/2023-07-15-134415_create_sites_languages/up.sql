CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sites_languages (
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	language_id UUID NOT NULL REFERENCES languages (id) ON DELETE CASCADE,
	PRIMARY KEY (site_id, language_id)
);

CREATE INDEX sites_languages_site_id_idx ON sites_languages (site_id);
CREATE INDEX sites_languages_language_id_idx ON sites_languages (language_id);
