INSERT INTO content_components (id, name, slug, component_name, hidden, internal) VALUES (
			'4f8897ff-4a17-4748-b72c-3494f4490c5a',
			'Select',
			'select',
			'SELECT',
			'false',
			'false'
		);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'b877166d-69cf-4745-8804-a439ed6f3daa',
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
						'4531db15-2825-4d5e-a8c6-a52969e3e982',
						'b877166d-69cf-4745-8804-a439ed6f3daa',
						'fields',
						'FIELDS',
						NULL
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'5a02d81d-5fd4-4907-82d5-c4260abb9c4f',
				'Label',
				'label',
				'This is the label',
				1,
				1,
				'4531db15-2825-4d5e-a8c6-a52969e3e982',
				'9c203432-ab17-4801-b518-cfd0a5e85ef5',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'd2f756ba-799f-4aff-93bf-aaecbf39dd26',
						'5a02d81d-5fd4-4907-82d5-c4260abb9c4f',
						'wrapperClassName',
						'TEXT',
						'u-col-md-6'
					);

INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'a6fb52ea-ef0f-4c46-924e-95a3555934c6',
				'Value',
				'value',
				'This is the value',
				1,
				1,
				'4531db15-2825-4d5e-a8c6-a52969e3e982',
				'9c203432-ab17-4801-b518-cfd0a5e85ef5',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);

INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'b5693b62-7774-4be0-9bd1-594fd7a65419',
						'a6fb52ea-ef0f-4c46-924e-95a3555934c6',
						'wrapperClassName',
						'TEXT',
						'u-col-md-6'
					);

