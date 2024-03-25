import {TFunction} from 'i18next';
import * as yup from 'yup';
import dayjs from 'dayjs';

import {Button, ButtonLink, ButtonSizes, IFiltersFilter, ITableColumn} from '~components';

import {FieldKeys, IContentType, ISite} from "~shared";


export const addContentComponentSchema = yup.object({
	contentComponentId: yup.string().required(),
	name: yup.string().required(),
});

export const CONTENT_LIST_FILTER = (t: TFunction, activeSite?: ISite, contentTypes?: IContentType[]): IFiltersFilter[] => [
	{
		name: 'Name',
		slug: 'name',
		contentComponent: FieldKeys.TEXT,
		config: {
			wrapperClassName: 'u-col-4 u-margin-bottom-none'
		}
	},
	{
		name: 'Language',
		slug: 'language',
		contentComponent: FieldKeys.SELECT,
		config: {
			options: (activeSite?.languages || []).map((lang) => ({ label: lang.name, value: lang.key })),
			wrapperClassName: 'u-col-4 u-margin-bottom-none'
		}
	},
	{
		name: 'Content Type',
		slug: 'contentTypeId',
		contentComponent: FieldKeys.SELECT,
		config: {
			options: (contentTypes || []).map((contentType) => ({ label: contentType.name, value: contentType.id })),
			wrapperClassName: 'u-col-4 u-margin-bottom-none'
		}
	},
]

export const CONTENT_LIST_COLUMNS = (t: TFunction, handleDelete: (contentItemId: string) => void): ITableColumn[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'language.key',
		label: 'Language',
		format: (value) => (value as string).toUpperCase()
	},
	{
		id: 'contentType.name',
		label: 'Content Type',
	},
	{
		id: 'updatedAt',
		label: 'Updated At',
		format: (value) => dayjs.utc(value as string).fromNow()
	},
	{
		id: 'published',
		label: 'Published',
		format(value, key, item, index) {
			if (value) {
				return <span className='las la-check u-text--success'></span>
			}

			return <span className='las la-times u-text--danger'></span>;
		},
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex">
				<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} className="u-margin-left-auto">
					<i className="las la-pen"></i> Edit
				</ButtonLink>
				<Button onClick={() => handleDelete(item.id as string)} size={ButtonSizes.SMALL} className="u-margin-left-sm">
					<i className="las la-trash"></i>
				</Button>
			</div>
		),
	},
];
