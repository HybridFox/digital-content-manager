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
		'cfae060b-cae4-4204-a72e-e54dde459d14',
		'Unpublished',
		'unpublished',
		'The content item has been unpublished and can not be edited anymore',
		'UNPUBLISHED',
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
		'7f4966a9-2f4e-4e85-a8f8-842f3bb3261c',
		'a5a2b150-0927-4c6b-800f-e82bc22e15fa',
		'10c6147c-8a9c-41b8-8c46-1c81df15276b',
		'10c6147c-8a9c-41b8-8c46-1c81df15276b'
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
		'11508211-b2e0-4b0a-8e97-79ed5b927cd8',
		'a5a2b150-0927-4c6b-800f-e82bc22e15fa',
		'10c6147c-8a9c-41b8-8c46-1c81df15276b',
		'cfae060b-cae4-4204-a72e-e54dde459d14'
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

INSERT INTO
	workflow_transitions (
		id,
		workflow_id,
		from_workflow_state_id,
		to_workflow_state_id
	)
VALUES
	(
		'fbe90c32-f63e-4fbc-89c8-3414cd13d144',
		'a5a2b150-0927-4c6b-800f-e82bc22e15fa',
		'6fed397b-25c5-4c98-80b5-66e7525f39a5',
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
		'8db91823-ce3b-476c-b244-7647bca3d8b7',
		'a5a2b150-0927-4c6b-800f-e82bc22e15fa',
		'6fed397b-25c5-4c98-80b5-66e7525f39a5',
		'cfae060b-cae4-4204-a72e-e54dde459d14'
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
		'bc51e070-db5b-4ed2-b811-b0e9dacbab8a',
		'a5a2b150-0927-4c6b-800f-e82bc22e15fa',
		'cfae060b-cae4-4204-a72e-e54dde459d14',
		'10c6147c-8a9c-41b8-8c46-1c81df15276b'
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
		'fbe5488c-0e07-47af-a253-3a49e04ec796',
		'a5a2b150-0927-4c6b-800f-e82bc22e15fa',
		'cfae060b-cae4-4204-a72e-e54dde459d14',
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
		'3da9ebe5-d698-431e-a08e-ddd8e08715a0',
		'a5a2b150-0927-4c6b-800f-e82bc22e15fa',
		'cfae060b-cae4-4204-a72e-e54dde459d14',
		'cfae060b-cae4-4204-a72e-e54dde459d14'
	);
