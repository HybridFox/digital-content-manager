const contentType = { // ContentType
    name: 'Auto',
    slug: 'auto',
    fields: [
        { // Field
			id: '62f1b328-ca51-4db4-9048-e2ddf8344891',
			content_type_id: '', // <-----
            name: 'Merk',
			slug: 'merk',
			contentComponent: { // FieldType
				name: 'Text',
				slug: 'text',
				componentName: 'text',
				configFields: [
					// More fields
				]
			},
			config: {
				defaultValue: '',
				required: false,
			}
        },
        { // Field
			id: 'd7335a4f-95e6-41a6-ad54-d9a8156b883f',
            name: 'Kleur',
			slug: 'kleur',
			contentComponent: { // FieldType
				name: 'Checkbox',
				slug: 'checkbox',
				componentName: 'checkbox',
				fields: [ // Field[]
					{
						name: 'options',
						label: 'Options',
						contentComponent: {
							name: 'Field group',
							slug: 'fieldGroup'
						},
						config: {
							defaultValue: '',
							required: false,
							fields: [
								// ...
							]
						}
					}
				]
			},
			config: {
				defaultValue: '',
				required: false,
			}
        }
    ]
}
