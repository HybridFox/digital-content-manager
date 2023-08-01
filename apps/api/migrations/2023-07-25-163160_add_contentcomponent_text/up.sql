INSERT INTO content_components (id, name, slug, component_name, hidden, internal, data_type) VALUES (
			'9c203432-ab17-4801-b518-cfd0a5e85ef5',
			'Text',
			'text',
			'TEXT',
			'false',
			'true',
			'TEXT'
		);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'ae45e680-89c3-4a12-a250-5161de87a91b',
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
						'edae777a-af86-4e46-9302-76ea51ba09aa',
						'ae45e680-89c3-4a12-a250-5161de87a91b',
						'placeholder',
						'TEXT',
						'This is the placeholder text'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'45140107-f671-40f5-9244-7c3a3b440d17',
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
						'3d7cb96b-e062-4c85-8264-d5c03de1a3f3',
						'45140107-f671-40f5-9244-7c3a3b440d17',
						'placeholder',
						'TEXT',
						'0'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'afb4fcd3-df23-40d2-b820-8a7b3a982fba',
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
						'ee3c5aaf-8bb8-41d7-8cec-ee4ab830e931',
						'afb4fcd3-df23-40d2-b820-8a7b3a982fba',
						'placeholder',
						'TEXT',
						'50'
					);

