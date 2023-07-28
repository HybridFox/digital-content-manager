CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE workflow_transitions (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	workflow_id UUID NOT NULL REFERENCES workflows (id) ON DELETE CASCADE,
	from_workflow_state_id UUID NOT NULL REFERENCES workflow_states (id) ON DELETE CASCADE,
	to_workflow_state_id UUID NOT NULL REFERENCES workflow_states (id) ON DELETE CASCADE
);

CREATE INDEX workflow_transitions_workflow_id_idx ON workflow_transitions (workflow_id);
CREATE INDEX workflow_transitions_from_workflow_state_id_idx ON workflow_transitions (from_workflow_state_id);
CREATE INDEX workflow_transitions_to_workflow_state_id_idx ON workflow_transitions (to_workflow_state_id);
