INSERT INTO content_components (id, name, slug, component_name, hidden, internal, data_type) VALUES (
	'0a644161-42e5-475b-ba6f-72a72a38c8ae',
	'Content Types',
	'content-types',
	'CONTENT_TYPES',
	'true',
	'true',
	'TEXT'
);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
	'5dc138fd-c9f7-487e-956c-5c37e69df8fc',
	'Content Types',
	'content-types',
	'Select the content types you want to be able to select',
	1,
	1,
	'a62ba634-799d-4172-8c3b-77c6edb03abd',
	'0a644161-42e5-475b-ba6f-72a72a38c8ae',
	'CONTENT-COMPONENT_CONFIG-FIELD'
);

UPDATE content_components
	SET name = 'Content Reference',
	    slug = 'content-reference',
		component_name = 'CONTENT_REFERENCE'
	WHERE id = 'a62ba634-799d-4172-8c3b-77c6edb03abd';
