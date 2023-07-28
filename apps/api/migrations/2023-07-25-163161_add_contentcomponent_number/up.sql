INSERT INTO content_components (id, name, slug, component_name, hidden, internal) VALUES (
			'51431723-714f-42d1-8ea7-eac549189b63',
			'Number',
			'number',
			'NUMBER',
			'false',
			'true'
		);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'74f67f9e-00eb-49bd-b815-8f317a8cb5fb',
				'Placeholder',
				'placeholder',
				'This field should contain the placeholder text',
				1,
				1,
				'51431723-714f-42d1-8ea7-eac549189b63',
				'9c203432-ab17-4801-b518-cfd0a5e85ef5',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'3db1c7d1-9e8d-4043-b700-0596d82c98ec',
						'74f67f9e-00eb-49bd-b815-8f317a8cb5fb',
						'placeholder',
						'TEXT',
						'This is the placeholder text'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'd0947815-96d8-41ca-81af-3973c418dada',
				'Minimum',
				'min',
				'Minimum the number should be',
				1,
				1,
				'51431723-714f-42d1-8ea7-eac549189b63',
				'51431723-714f-42d1-8ea7-eac549189b63',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'10a66c10-08c4-4110-884b-ea3d7e34f3e1',
						'd0947815-96d8-41ca-81af-3973c418dada',
						'placeholder',
						'TEXT',
						'0'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'8bdf54f8-a898-45fe-8769-12063d5072fc',
				'Maximum',
				'max',
				'Maximum the number should be',
				1,
				1,
				'51431723-714f-42d1-8ea7-eac549189b63',
				'51431723-714f-42d1-8ea7-eac549189b63',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'82caf9cf-b74e-4b8d-9908-a41de1615504',
						'8bdf54f8-a898-45fe-8769-12063d5072fc',
						'placeholder',
						'TEXT',
						'50'
					);

