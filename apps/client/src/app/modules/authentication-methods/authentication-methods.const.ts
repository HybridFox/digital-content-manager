import { AUTHENTICATION_METHOD_KINDS, FIELD_KEYS, IField } from "@ibs/shared"

export const AUTHENTICATION_METHOD_OPTIONS = [
	{
		label: 'Local Filesystem',
		value: AUTHENTICATION_METHOD_KINDS.LOCAL
	}
]


export const AUTHENTICATION_METHOD_FIELDS: Record<AUTHENTICATION_METHOD_KINDS, IField[]> = {
	[AUTHENTICATION_METHOD_KINDS.LOCAL]: [
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'Base path',
			slug: 'base_path',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FIELD_KEYS.TEXT,
				configurationFields: [],
				fields: [],
				createdAt: 'string',
				updatedAt: 'string',
			}
		}
	]
}
