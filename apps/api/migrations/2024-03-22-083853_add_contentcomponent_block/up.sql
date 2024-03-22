ALTER TYPE field_types ADD VALUE IF NOT EXISTS 'BLOCK_FIELD' AFTER 'CONTENT-COMPONENT_CONFIG-FIELD';

INSERT INTO content_components (id, name, slug, component_name, hidden, internal, data_type) VALUES (
	'72f86551-c9a3-40bc-9164-ceec72099bef',
	'Block',
	'block',
	'BLOCK',
	'false',
	'true',
	'BLOCK'
);
