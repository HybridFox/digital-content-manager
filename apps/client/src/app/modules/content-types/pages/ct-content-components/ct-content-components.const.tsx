import {
	Button,
	ButtonLink,
	ButtonSizes,
	ButtonTypes,
	ITableColumn,
} from '@ibs/components';
import * as yup from 'yup';

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
