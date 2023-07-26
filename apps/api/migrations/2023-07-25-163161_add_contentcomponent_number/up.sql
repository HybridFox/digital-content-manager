INSERT INTO content_components (id, name, slug, component_name, hidden, internal) VALUES (
			'51431723-714f-42d1-8ea7-eac549189b63',
			'Number',
			'number',
			'NUMBER',
			'false',
			'false'
		);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'64e1b06e-8d34-4150-9a0e-e895e9b47b5e',
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
						'70bf91a8-499e-45e4-8e14-3ee8cf0eff64',
						'64e1b06e-8d34-4150-9a0e-e895e9b47b5e',
						'placeholder',
						'TEXT',
						'This is the placeholder text'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'2dcdc947-9a66-4e43-b951-6f227b6f62f1',
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
						'9ebb3324-6c2d-4f6c-8bca-a223e7db1a3e',
						'2dcdc947-9a66-4e43-b951-6f227b6f62f1',
						'placeholder',
						'TEXT',
						'0'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'3a56efc1-8288-4b69-af71-2c51b51a58cd',
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
						'33d471f0-d06f-4435-8bfa-b949f5b4d90d',
						'3a56efc1-8288-4b69-af71-2c51b51a58cd',
						'placeholder',
						'TEXT',
						'50'
					);

