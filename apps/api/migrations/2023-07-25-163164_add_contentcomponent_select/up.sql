INSERT INTO content_components (id, name, slug, component_name, hidden, internal) VALUES (
			'4f8897ff-4a17-4748-b72c-3494f4490c5a',
			'Select',
			'select',
			'SELECT',
			'false',
			'true'
		);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'8146d2a0-ecae-460a-9255-2326604b3990',
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
						'0310cd76-dd47-449d-930b-38a2c8b9adb7',
						'8146d2a0-ecae-460a-9255-2326604b3990',
						'fields',
						'FIELDS',
						NULL
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'1f30f681-d20f-41db-b88b-cf9c88a698d8',
				'Label',
				'label',
				'This is the label',
				1,
				1,
				'0310cd76-dd47-449d-930b-38a2c8b9adb7',
				'9c203432-ab17-4801-b518-cfd0a5e85ef5',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'af3d4f2c-58e8-4f4b-9d9a-e8b161788885',
						'1f30f681-d20f-41db-b88b-cf9c88a698d8',
						'wrapperClassName',
						'TEXT',
						'u-col-md-6'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'0c15e59f-58af-49fa-a183-d6c684dd0661',
				'Value',
				'value',
				'This is the value',
				1,
				1,
				'0310cd76-dd47-449d-930b-38a2c8b9adb7',
				'9c203432-ab17-4801-b518-cfd0a5e85ef5',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'e3f50f09-f984-49b6-a3ed-1a56d65cfc31',
						'0c15e59f-58af-49fa-a183-d6c684dd0661',
						'wrapperClassName',
						'TEXT',
						'u-col-md-6'
					);

