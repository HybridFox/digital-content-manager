CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE workflow_state_technical_states AS ENUM('DRAFT', 'PUBLISHED');

CREATE TABLE workflow_states (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	slug TEXT NOT NULL,
	description TEXT NOT NULL,
	technical_state workflow_state_technical_states NOT NULL,
	internal BOOLEAN NOT NULL DEFAULT FALSE,
	removable BOOLEAN NOT NULL DEFAULT TRUE,
	deleted BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
