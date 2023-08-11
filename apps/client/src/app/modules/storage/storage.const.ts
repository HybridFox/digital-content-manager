import { FIELD_KEYS, IField, STORAGE_KINDS } from "@ibs/shared"

export const STORAGE_KIND_OPTIONS = [
	{
		label: 'Local Filesystem',
		value: STORAGE_KINDS.LOCAL_FS
	}
]


export const STORAGE_KIND_FIELDS: Record<STORAGE_KINDS, IField[]> = {
	[STORAGE_KINDS.LOCAL_FS]: [
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
	],
	[STORAGE_KINDS.S3_BUCKET]: [
		
	]
}
