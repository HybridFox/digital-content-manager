CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE languages (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	key TEXT NOT NULL,
	name TEXT NOT NULL
);
