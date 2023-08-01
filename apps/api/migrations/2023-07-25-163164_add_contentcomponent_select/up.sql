INSERT INTO content_components (id, name, slug, component_name, hidden, internal, data_type) VALUES (
			'4f8897ff-4a17-4748-b72c-3494f4490c5a',
			'Select',
			'select',
			'SELECT',
			'false',
			'true',
			'TEXT'
		);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'e5e5cee8-1866-422c-83d3-d238fa34eebe',
				'Options',
				'options',
				'Options shown in the dropdown',
				1,
				0,
				'4f8897ff-4a17-4748-b72c-3494f4490c5a',
				'fc8583d1-3316-4b83-9426-daa95e72e043',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'6f9fb3b4-ceaa-44ad-b6c5-f1b6a1655d4f',
						'e5e5cee8-1866-422c-83d3-d238fa34eebe',
						'fields',
						'FIELDS',
						NULL
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'c1cea4d1-9dd1-4ccc-95e5-d2eca97441f9',
				'Label',
				'label',
				'This is the label',
				1,
				1,
				'6f9fb3b4-ceaa-44ad-b6c5-f1b6a1655d4f',
				'9c203432-ab17-4801-b518-cfd0a5e85ef5',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'cc7556fb-5d99-43fb-8e50-077c07f4f5b5',
						'c1cea4d1-9dd1-4ccc-95e5-d2eca97441f9',
						'wrapperClassName',
						'TEXT',
						'u-col-md-6'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'd3061739-a742-40f6-a870-e80ba533bad7',
				'Value',
				'value',
				'This is the value',
				1,
				1,
				'6f9fb3b4-ceaa-44ad-b6c5-f1b6a1655d4f',
				'9c203432-ab17-4801-b518-cfd0a5e85ef5',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'20935ebc-95f2-4b9e-b26d-60e7e2b3a213',
						'd3061739-a742-40f6-a870-e80ba533bad7',
						'wrapperClassName',
						'TEXT',
						'u-col-md-6'
					);

