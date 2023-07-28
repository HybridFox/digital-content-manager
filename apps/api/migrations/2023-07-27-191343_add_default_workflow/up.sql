INSERT INTO
	workflows (
		id,
		name,
		slug,
		description,
		default_workflow_state_id,
		internal,
		removable
	)
VALUES
	(
		'a5a2b150-0927-4c6b-800f-e82bc22e15fa',
		'Default Workflow',
		'default-workflow',
		'This is the default workflow consisting of a simple draft and published state',
		'10c6147c-8a9c-41b8-8c46-1c81df15276b',
		TRUE,
		FALSE
	);

INSERT INTO
	workflow_states (
		id,
		name,
		slug,
		description,
		technical_state,
		internal,
		removable
	)
VALUES
	(
		'10c6147c-8a9c-41b8-8c46-1c81df15276b',
		'Draft',
		'draft',
		'The content item is not published and edits are kept as a draft',
		'DRAFT',
		TRUE,
		FALSE
	);

INSERT INTO
	workflow_states (
		id,
		name,
		slug,
		description,
		technical_state,
		internal,
		removable
	)
VALUES
	(
		'6fed397b-25c5-4c98-80b5-66e7525f39a5',
		'Published',
		'published',
		'The content item is published and edits are also published',
		'PUBLISHED',
		TRUE,
		FALSE
	);

INSERT INTO
	workflow_transitions (
		id,
		workflow_id,
		from_workflow_state_id,
		to_workflow_state_id
	)
VALUES
	(
		'bc5865c7-5815-4321-bf58-cccb49e9f97f',
		'a5a2b150-0927-4c6b-800f-e82bc22e15fa',
		'10c6147c-8a9c-41b8-8c46-1c81df15276b',
		'6fed397b-25c5-4c98-80b5-66e7525f39a5'
	);

INSERT INTO
	workflow_transitions (
		id,
		workflow_id,
		from_workflow_state_id,
		to_workflow_state_id
	)
VALUES
	(
		'9dee6202-af0d-4a3c-bb8d-8a24cb510398',
		'a5a2b150-0927-4c6b-800f-e82bc22e15fa',
		'6fed397b-25c5-4c98-80b5-66e7525f39a5',
		'10c6147c-8a9c-41b8-8c46-1c81df15276b'
	);
