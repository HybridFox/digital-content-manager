import { Button, ButtonSizes, ButtonTypes, ITableColumn } from '@ibs/components';
import { IField } from '@ibs/shared';
import * as yup from 'yup';

export const selectLanguageSchema = yup.object({
	language: yup.string().required()
})

export const CONTENT_CREATE_COLUMNS = (onSelectContentType: (contentTypeId: string) => void, limitOccurrences = false): ITableColumn[] => [
	{
		id: 'name',
		label: 'Name',
	},
	// {
	// 	id: 'slug',
	// 	label: 'Slug',
	// },
	// {
	// 	id: 'kind',
	// 	label: 'Kind',
	// 	format: (value) => <Badge>{CONTENT_TYPE_KINDS_TRANSLATIONS[value as ContentTypeKinds]}</Badge>,
	// },
	{
		id: 'contentOccurrences',
		label: 'Content Occurrences',
		// format: (value) => ((value as IField[]) || []).length,
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex">
				<Button disabled={limitOccurrences && (item.contentOccurrences as number) > 0} onClick={() => onSelectContentType(item.id as string)} size={ButtonSizes.SMALL} className="u-margin-left-auto">
					<i className="las la-plus"></i> Create
				</Button>
			</div>
		),
	},
];
