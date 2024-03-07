import * as yup from 'yup';

import {
	Button,
	ButtonLink,
	ButtonSizes,
	ButtonTypes,
	ITableColumn,
} from '~components';

export const addContentComponentSchema = yup.object({
	contentComponentId: yup.string().required(),
	name: yup.string().required(),
});

export const CONTENT_TYPE_DETAIL_COLUMNS = (
	onDeleteField: (fieldId: string) => void
): ITableColumn[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'slug',
		label: 'Slug',
	},
	{
		id: 'contentComponent.name',
		label: 'Content Component',
	},
	{
		id: 'multiple',
		label: 'Multiple',
		format(value, key, item, index) {
			if (item.min !== 1 || item.max !== 1) {
				return <span className='las la-check u-text--success'></span>
			}

			return <span className='las la-times u-text--danger'></span>;
		},
	},
	{
		id: 'multiLanguage',
		label: 'Multilanguage',
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
				<ButtonLink
					to={`../fields/${item.id}`}
					size={ButtonSizes.SMALL}
					type={ButtonTypes.SECONDARY}
					className="u-margin-left-auto"
				>
					<i className="las la-pen"></i> Edit
				</ButtonLink>
				<Button
					size={ButtonSizes.SMALL}
					type={ButtonTypes.SECONDARY}
					className="u-margin-left-sm"
					onClick={() => onDeleteField(item.id as string)}
				>
					<i className="las la-trash"></i>
				</Button>
			</div>
		),
	},
];
