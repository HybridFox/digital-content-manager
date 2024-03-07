import { AUTHENTICATION_METHOD_KINDS, FIELD_KEYS, IField } from "~shared"

export const AUTHENTICATION_METHOD_OPTIONS = [
	{
		label: 'Local Auth',
		value: AUTHENTICATION_METHOD_KINDS.LOCAL
	},
	{
		label: 'OAuth2',
		value: AUTHENTICATION_METHOD_KINDS.OAUTH2
	}
]


export const AUTHENTICATION_METHOD_FIELDS: Record<AUTHENTICATION_METHOD_KINDS, IField[]> = {
	[AUTHENTICATION_METHOD_KINDS.LOCAL]: [],
	[AUTHENTICATION_METHOD_KINDS.OAUTH2]: [
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'Client ID',
			slug: 'client_id',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FIELD_KEYS.TEXT,
				configurationFields: [],
				fields: [],
			}
		},
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'Client Secret',
			slug: 'client_secret',
			min: 1,
			max: 1,
			config: {
				type: 'password'
			},
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FIELD_KEYS.TEXT,
				configurationFields: [],
				fields: [],
			}
		},
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'Auth URL',
			slug: 'auth_url',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FIELD_KEYS.TEXT,
				configurationFields: [],
				fields: [],
			}
		},
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'Token URL',
			slug: 'token_url',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FIELD_KEYS.TEXT,
				configurationFields: [],
				fields: [],
			}
		},
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'Userinfo URL',
			slug: 'userinfo_url',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FIELD_KEYS.TEXT,
				configurationFields: [],
				fields: [],
			}
		},
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'Scopes',
			slug: 'scopes',
			min: 1,
			max: 0,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FIELD_KEYS.TEXT,
				configurationFields: [],
				fields: [],
			}
		}
	]
}
