const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CC_FIELD_GROUP = 'fc8583d1-3316-4b83-9426-daa95e72e043';
const CC_TEXT = '9c203432-ab17-4801-b518-cfd0a5e85ef5';
const CC_NUMBER = '51431723-714f-42d1-8ea7-eac549189b63';
const CC_SELECT = '4f8897ff-4a17-4748-b72c-3494f4490c5a';
const CC_RADIO = '308b6bd6-66bb-453a-a283-fe2503d80e85';
const CC_CHECKBOX = '99804f6a-cb8f-491c-9f72-632cb963d626';

const contentComponents = [
	{
		id: CC_FIELD_GROUP,
		name: 'Field Group',
		slug: 'field-group',
		componentName: 'FIELD_GROUP',
		hidden: true,
		configurationFields: []
	},
	{
		id: CC_TEXT,
		name: 'Text',
		slug: 'text',
		componentName: 'TEXT',
		configurationFields: [
			{
				contentComponentId: CC_TEXT,
				name: 'Placeholder',
				slug: 'placeholder',
				description: 'This field should contain the placeholder text',
				config: {
					placeholder: {
						content: 'This is the placeholder text'
					}
				}
			},
			{
				contentComponentId: CC_NUMBER,
				name: 'Minimum Length',
				slug: 'minLength',
				description: 'Minimum length the text should be',
				config: {
					placeholder: {
						content: '0'
					}
				}
			},
			{
				contentComponentId: CC_NUMBER,
				name: 'Maximum Length',
				slug: 'maxLength',
				description: 'Maximum length the text should be',
				config: {
					placeholder: {
						content: '50'
					}
				}
			}
		]
	},
	{
		id: CC_NUMBER,
		name: 'Number',
		slug: 'number',
		componentName: 'NUMBER',
		configurationFields: [
			{
				contentComponentId: CC_TEXT,
				name: 'Placeholder',
				slug: 'placeholder',
				description: 'This field should contain the placeholder text',
				config: {
					placeholder: {
						content: 'This is the placeholder text'
					}
				}
			},
			{
				contentComponentId: CC_NUMBER,
				name: 'Minimum',
				slug: 'min',
				description: 'Minimum the number should be',
				config: {
					placeholder: {
						content: '0'
					}
				}
			},
			{
				contentComponentId: CC_NUMBER,
				name: 'Maximum',
				slug: 'max',
				description: 'Maximum the number should be',
				config: {
					placeholder: {
						content: '50'
					}
				}
			}
		]
	},
	{
		name: 'Richtext',
		slug: 'richtext',
		componentName: 'RICH_TEXT',
		configurationFields: []
	},
	{
		name: 'URL',
		slug: 'url',
		componentName: 'URL',
		configurationFields: [
			// HTTPS/HTTP/ETC...
		]
	},
	{
		id: CC_SELECT,
		name: 'Select',
		slug: 'select',
		componentName: 'SELECT',
		configurationFields: [,
			{
				contentComponentId: CC_FIELD_GROUP,
				name: 'Options',
				slug: 'options',
				min: 1,
				max: 0,
				description: 'Options shown in the dropdown',
				config: {
					fields: {
						type: 'FIELDS',
						content: [
							{
								contentComponentId: CC_TEXT,
								name: 'Label',
								slug: 'label',
								description: 'This is the label',
								config: {
									wrapperClassName: {
										content: 'u-col-md-6',
									}
								}
							},
							{
								contentComponentId: CC_TEXT,
								name: 'Value',
								slug: 'value',
								description: 'This is the value',
								config: {
									wrapperClassName: {
										content: 'u-col-md-6',
									}
								}
							}
						]
					}
				}
			}
		]
	},
	{
		id: CC_RADIO,
		name: 'Radio',
		slug: 'radio',
		componentName: 'RADIO',
		configurationFields: []
	},
	{
		id: CC_CHECKBOX,
		name: 'Checkbox',
		slug: 'checkbox',
		componentName: 'CHECKBOX',
		configurationFields: []
	},
	{
		name: 'Datetime',
		slug: 'datetime',
		componentName: 'DATETIME',
		configurationFields: []
	},
	{
		name: 'Map',
		slug: 'map',
		componentName: 'MAP',
		configurationFields: []
	},
	{
		name: 'Media',
		slug: 'media',
		componentName: 'MEDIA',
		configurationFields: []
	},
	{
		name: 'Toggle',
		slug: 'toggle',
		componentName: 'TOGGLE',
		configurationFields: []
	},
	{
		name: 'Reference',
		slug: 'reference',
		componentName: 'REFERENCE',
		configurationFields: []
	},
];

let number = 163159;
fs.rmSync(path.join(__dirname, 'output'), { recursive: true, force: true });
fs.mkdirSync(path.join(__dirname, 'output'));

const generateFields = (folderName, parentId, fields) => {
	fields.forEach((partialField) => {
		let field = {
			id: crypto.randomUUID(),
			description: '',
			min: 1,
			max: 1,
			...partialField,
		};

		fs.appendFileSync(
			path.join(__dirname, 'output', folderName, 'up.sql'),
			`INSERT INTO fields (id, name, slug, description, min, max, parent_id, content_component_id, field_type) VALUES (
				'${field.id}',
				'${field.name}',
				'${field.slug}',
				'${field.description}',
				${field.min},
				${field.max},
				'${parentId}',
				'${field.contentComponentId}',
				'CONTENT-COMPONENT_CONFIG-FIELD'
			);\n\n`
		);
		fs.appendFileSync(path.join(__dirname, 'output', folderName, 'down.sql'), `DELETE FROM fields WHERE id = '${field.id}';\n`);

		Object.keys(field.config || {}).forEach((configKey) => {
			let config = {
				id: crypto.randomUUID(),
				key: configKey,
				type: 'TEXT',
				...field.config[configKey],
			};

			if (config.type === 'TEXT') {
				fs.appendFileSync(
					path.join(__dirname, 'output', folderName, 'up.sql'),
					`INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'${config.id}',
						'${field.id}',
						'${config.key}',
						'${config.type}',
						'${config.content}'
					);\n\n`
				);
				fs.appendFileSync(path.join(__dirname, 'output', folderName, 'down.sql'), `DELETE FROM field_config WHERE id = '${config.id}';\n`);
				return;
			}


			if (config.type === 'FIELDS') {
				fs.appendFileSync(
					path.join(__dirname, 'output', folderName, 'up.sql'),
					`INSERT INTO field_config (id, field_id, config_key, config_type, content) VALUES (
						'${config.id}',
						'${field.id}',
						'${config.key}',
						'${config.type}',
						NULL
					);\n\n`
				);
				fs.appendFileSync(path.join(__dirname, 'output', folderName, 'down.sql'), `DELETE FROM field_config WHERE id = '${config.id}';\n`);
					
				generateFields(folderName, config.id, config.content)

				return;
			}
			
		})
	})
}

contentComponents.forEach((partialCc) => {
	const cc = {
		id: crypto.randomUUID(),
		hidden: false,
		internal: true,
		...partialCc,
	}
	const folderName = `2023-07-25-${number}_add_contentcomponent_${cc.slug}`;
	number++;

	fs.mkdirSync(path.join(__dirname, 'output', folderName));
	fs.appendFileSync(
		path.join(__dirname, 'output', folderName, 'up.sql'),
		`INSERT INTO content_components (id, name, slug, component_name, hidden, internal) VALUES (
			'${cc.id}',
			'${cc.name}',
			'${cc.slug}',
			'${cc.componentName}',
			'${cc.hidden}',
			'${cc.internal}'
		);\n\n`
	);
	fs.appendFileSync(path.join(__dirname, 'output', folderName, 'down.sql'), `DELETE FROM content_components WHERE id = '${cc.id}';\n`);

	generateFields(folderName, cc.id, cc.configurationFields)
})
