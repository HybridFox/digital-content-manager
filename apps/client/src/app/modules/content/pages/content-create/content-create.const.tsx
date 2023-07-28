import { ButtonLink, ButtonSizes, ButtonTypes, ITableColumn } from '@ibs/components';
import { IField } from '@ibs/shared';

export const CONTENT_CREATE_COLUMNS: ITableColumn[] = [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'slug',
		label: 'Slug',
	},
	// {
	// 	id: 'kind',
	// 	label: 'Kind',
	// 	format: (value) => <Badge>{CONTENT_TYPE_KINDS_TRANSLATIONS[value as ContentTypeKinds]}</Badge>,
	// },
	{
		id: 'fields',
		label: 'Content Components',
		format: (value) => ((value as IField[]) || []).length,
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex">
				<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className="u-margin-left-auto">
					<i className="las la-plus"></i> Create
				</ButtonLink>
			</div>
		),
	},
];
