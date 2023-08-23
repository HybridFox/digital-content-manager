DELETE FROM content_components WHERE id = '0a644161-42e5-475b-ba6f-72a72a38c8ae';
DELETE FROM fields WHERE id = '5dc138fd-c9f7-487e-956c-5c37e69df8fc';
UPDATE content_components
	SET name = 'Reference',
	    slug = 'reference',
		component_name = 'REFERENCE'
	WHERE id = 'a62ba634-799d-4172-8c3b-77c6edb03abd';
