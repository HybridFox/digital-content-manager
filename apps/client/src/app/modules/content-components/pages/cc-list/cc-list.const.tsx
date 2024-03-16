import { TFunction } from 'i18next';
import * as yup from 'yup';

import { Button, ButtonLink, ButtonSizes, ITableColumn } from '~components';

export const addContentComponentSchema = yup.object({
	contentComponentId: yup.string().required(),
	name: yup.string().required(),
});

export const CONTENT_COMPONENTS_LIST_COLUMNS = (t: TFunction, handleDelete: (ccId: string) => void, confirmLoading: boolean): ITableColumn[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'slug',
		label: 'Slug',
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex">
				<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} className="u-margin-left-auto">
					<i className="las la-pen"></i> Edit
				</ButtonLink>
				<Button
					size={ButtonSizes.SMALL}
					className="u-margin-left-sm"
					confirmable
					confirmText={`Are you sure you wish to delete "${item.name}"?`}
					onClick={() => handleDelete(item.id as string)}
					confirmLoading={confirmLoading}
				>
					<i className="las la-trash"></i>
				</Button>
			</div>
		),
	},
];
