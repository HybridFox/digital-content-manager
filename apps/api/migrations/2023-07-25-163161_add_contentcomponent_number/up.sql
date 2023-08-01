INSERT INTO content_components (id, name, slug, component_name, hidden, internal, data_type) VALUES (
			'51431723-714f-42d1-8ea7-eac549189b63',
			'Number',
			'number',
			'NUMBER',
			'false',
			'true',
			'NUMBER'
		);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'6cdd08f4-43ea-46b0-a3d4-b729c4342241',
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
						'3a1b4609-be87-43bf-a081-c922802d0305',
						'6cdd08f4-43ea-46b0-a3d4-b729c4342241',
						'placeholder',
						'TEXT',
						'This is the placeholder text'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'54d9d2fe-c98d-49a6-a314-835a1ebfdb6d',
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
						'8e7319b9-36e1-45b6-b69b-a0305dae31d9',
						'54d9d2fe-c98d-49a6-a314-835a1ebfdb6d',
						'placeholder',
						'TEXT',
						'0'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'88077646-73ea-4c33-a6cc-b2b6fb6e597d',
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
						'd1c1cd1d-8d29-4f86-94f3-f4b770fc5b8c',
						'88077646-73ea-4c33-a6cc-b2b6fb6e597d',
						'placeholder',
						'TEXT',
						'50'
					);

