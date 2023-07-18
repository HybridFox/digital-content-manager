-- -------------------------------------
-- Text
-- -------------------------------------
INSERT INTO content_components (
	id,
	name,
	slug,
	component_name
) VALUES (
	'a93be33b-5ef1-44c6-b48f-587d033821c2',
	'Text',
	'text',
	'text'
);

-- Label
INSERT INTO fields (
	id,
	name,
	slug,
	parent_id,
	content_component_id
) VALUES (
	'fcf02655-52d3-46c3-9d6b-c524bed922c4',
	'Label',
	'label',
	'a93be33b-5ef1-44c6-b48f-587d033821c2',
	'a93be33b-5ef1-44c6-b48f-587d033821c2'
);

INSERT INTO field_config (
	id,
	field_id,
	config_key,
	config_type,
	content
) VALUES (
	'82c53be6-3831-4414-9108-e7ad579693dc',
	'fcf02655-52d3-46c3-9d6b-c524bed922c4',
	'label',
	'text',
	'Label'
);

INSERT INTO field_config (
	id,
	field_id,
	config_key,
	config_type,
	content
) VALUES (
	'3e5ab9a5-79f8-4de6-9578-7642b60fc9c3',
	'fcf02655-52d3-46c3-9d6b-c524bed922c4',
	'placeholder',
	'text',
	'The label that will appear above the field'
);

-- Placeholder
INSERT INTO fields (
	id,
	name,
	slug,
	parent_id,
	content_component_id
) VALUES (
	'd24252b2-5b6c-4776-81be-247a38b905ba',
	'Placeholder',
	'placeholder',
	'a93be33b-5ef1-44c6-b48f-587d033821c2',
	'a93be33b-5ef1-44c6-b48f-587d033821c2'
);

INSERT INTO field_config (
	id,
	field_id,
	config_key,
	config_type,
	content
) VALUES (
	'8565ab8c-52f6-43c2-bf0b-bd999ac223e3',
	'd24252b2-5b6c-4776-81be-247a38b905ba',
	'label',
	'text',
	'Placeholder'
);

INSERT INTO field_config (
	id,
	field_id,
	config_key,
	config_type,
	content
) VALUES (
	'b45f908d-44ce-48c0-9d02-9e4031c849d5',
	'd24252b2-5b6c-4776-81be-247a38b905ba',
	'placeholder',
	'text',
	'The label that will appear as a hint in the field'
);

-- Default value
INSERT INTO fields (
	id,
	name,
	slug,
	parent_id,
	content_component_id
) VALUES (
	'a3239408-6869-4995-b942-2910127b0207',
	'Default value',
	'defaultValue',
	'a93be33b-5ef1-44c6-b48f-587d033821c2',
	'a93be33b-5ef1-44c6-b48f-587d033821c2'
);

INSERT INTO field_config (
	id,
	field_id,
	config_key,
	config_type,
	content
) VALUES (
	'3d0d909e-b3e3-4bec-97d8-604bc9c4e746',
	'a3239408-6869-4995-b942-2910127b0207',
	'label',
	'text',
	'Default value'
);

INSERT INTO field_config (
	id,
	field_id,
	config_key,
	config_type,
	content
) VALUES (
	'e3c6e621-ca22-4e62-abdc-57976fecc5a2',
	'a3239408-6869-4995-b942-2910127b0207',
	'placeholder',
	'text',
	'Default filled in value'
);
