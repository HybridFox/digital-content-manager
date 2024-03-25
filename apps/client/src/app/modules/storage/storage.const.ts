import { FieldKeys, IField, StorageKinds } from "~shared"

export const STORAGE_KIND_OPTIONS = [
	{
		label: 'Local Filesystem',
		value: StorageKinds.LOCAL_FS
	},
	{
		label: 'S3 Bucket',
		value: StorageKinds.S3_BUCKET
	},
	{
		label: 'FTP',
		value: StorageKinds.FTP
	}
]


export const STORAGE_KIND_FIELDS: Record<StorageKinds, IField[]> = {
	[StorageKinds.LOCAL_FS]: [
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
				componentName: FieldKeys.TEXT,
				configurationFields: [],
				fields: [],
				createdAt: 'string',
				updatedAt: 'string',
			}
		}
	],
	[StorageKinds.S3_BUCKET]: [
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'S3 Endpoint',
			slug: 'endpoint',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FieldKeys.TEXT,
				configurationFields: [],
				fields: [],
				createdAt: 'string',
				updatedAt: 'string',
			}
		},
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'S3 Access Key',
			slug: 'access_key',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FieldKeys.TEXT,
				configurationFields: [],
				fields: [],
				createdAt: 'string',
				updatedAt: 'string',
			}
		},
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'S3 Secret Key',
			slug: 'secret_key',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FieldKeys.TEXT,
				configurationFields: [],
				fields: [],
				createdAt: 'string',
				updatedAt: 'string',
			}
		},
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'S3 Regio',
			slug: 'region',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FieldKeys.TEXT,
				configurationFields: [],
				fields: [],
				createdAt: 'string',
				updatedAt: 'string',
			}
		},
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'Bucket Name',
			slug: 'bucket_name',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FieldKeys.TEXT,
				configurationFields: [],
				fields: [],
				createdAt: 'string',
				updatedAt: 'string',
			}
		}
	],
	[StorageKinds.FTP]: [
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'FTP Server',
			slug: 'server',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FieldKeys.TEXT,
				configurationFields: [],
				fields: [],
				createdAt: 'string',
				updatedAt: 'string',
			}
		},
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'FTP Username',
			slug: 'ftp_username',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FieldKeys.TEXT,
				configurationFields: [],
				fields: [],
				createdAt: 'string',
				updatedAt: 'string',
			}
		},
		{
			id: '5cf292a2-8a19-4bab-a637-dde0199c5d8b',
			name: 'FTP Password',
			slug: 'ftp_password',
			min: 1,
			max: 1,
			contentComponent: {
				id: 'f665034b-1dbc-4fda-ab62-da1ef6d4b054',
				name: 'Text',
				slug: 'text',
				componentName: FieldKeys.TEXT,
				configurationFields: [],
				fields: [],
				createdAt: 'string',
				updatedAt: 'string',
			}
		},
	]
}
