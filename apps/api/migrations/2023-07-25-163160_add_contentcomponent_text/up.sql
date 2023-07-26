INSERT INTO content_components (id, name, slug, component_name, hidden, internal) VALUES (
			'9c203432-ab17-4801-b518-cfd0a5e85ef5',
			'Text',
			'text',
			'TEXT',
			'false',
			'false'
		);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'9a20d59c-8169-4609-a690-49c9d101e215',
				'Placeholder',
				'placeholder',
				'This field should contain the placeholder text',
				1,
				1,
				'9c203432-ab17-4801-b518-cfd0a5e85ef5',
				'9c203432-ab17-4801-b518-cfd0a5e85ef5',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'a51da2d1-26ac-4ac9-b112-e1c5b8b8e4a8',
						'9a20d59c-8169-4609-a690-49c9d101e215',
						'placeholder',
						'TEXT',
						'This is the placeholder text'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'd11a3cc6-3e89-4ae5-8eaa-2bf7bbe131d3',
				'Minimum Length',
				'minLength',
				'Minimum length the text should be',
				1,
				1,
				'9c203432-ab17-4801-b518-cfd0a5e85ef5',
				'51431723-714f-42d1-8ea7-eac549189b63',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'b0b959a1-1307-4d30-94bf-faec1bc1f458',
						'd11a3cc6-3e89-4ae5-8eaa-2bf7bbe131d3',
						'placeholder',
						'TEXT',
						'0'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'5324eb26-4c4b-4412-b2c8-53573715ae3c',
				'Maximum Length',
				'maxLength',
				'Maximum length the text should be',
				1,
				1,
				'9c203432-ab17-4801-b518-cfd0a5e85ef5',
				'51431723-714f-42d1-8ea7-eac549189b63',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'f6432576-e9e5-42a5-b8ed-948200b5b5fa',
						'5324eb26-4c4b-4412-b2c8-53573715ae3c',
						'placeholder',
						'TEXT',
						'50'
					);

