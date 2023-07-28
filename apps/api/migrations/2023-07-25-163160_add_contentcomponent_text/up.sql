INSERT INTO content_components (id, name, slug, component_name, hidden, internal) VALUES (
			'9c203432-ab17-4801-b518-cfd0a5e85ef5',
			'Text',
			'text',
			'TEXT',
			'false',
			'true'
		);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'08aa003c-b4b0-407f-a354-03cdba620f1a',
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
						'1a1bde60-6ac3-42dc-8f55-1bb250a31599',
						'08aa003c-b4b0-407f-a354-03cdba620f1a',
						'placeholder',
						'TEXT',
						'This is the placeholder text'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'3b9b9694-bf68-4e52-b3e2-6647755a9d14',
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
						'62730ebe-47d3-4a80-841f-1678095a7d2a',
						'3b9b9694-bf68-4e52-b3e2-6647755a9d14',
						'placeholder',
						'TEXT',
						'0'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'6b0a3690-a7d3-4a63-98f7-2e02aa91c9bd',
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
						'c3136e59-74db-4f1a-ae17-2e195df29cd0',
						'6b0a3690-a7d3-4a63-98f7-2e02aa91c9bd',
						'placeholder',
						'TEXT',
						'50'
					);

