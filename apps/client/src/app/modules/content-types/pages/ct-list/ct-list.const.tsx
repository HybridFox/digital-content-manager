import { Button, ButtonLink, ButtonSizes, ButtonTypes, ITableColumn } from '@ibs/components';
import * as yup from 'yup';

export const addContentComponentSchema = yup.object({
	contentComponentId: yup.string().required(),
	name: yup.string().required(),
});

export const CONTENT_TYPE_LIST_COLUMNS: ITableColumn[] = [
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
		format: (value, key, item) => <div className='u-display-flex'>
			<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className='u-margin-left-auto'><i className='las la-pen'></i> Edit</ButtonLink>
			<Button size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className='u-margin-left-sm'><i className='las la-trash'></i></Button>
		</div>,
	},
];
