CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE workflow_transition_requirements (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	workflow_transition_id UUID NOT NULL REFERENCES workflow_transitions (id) ON DELETE CASCADE,
	type TEXT NOT NULL,
	value JSONB NOT NULL
);

CREATE INDEX workflow_transition_requirements_workflow_transition_id_idx ON workflow_transition_requirements (workflow_transition_id);
