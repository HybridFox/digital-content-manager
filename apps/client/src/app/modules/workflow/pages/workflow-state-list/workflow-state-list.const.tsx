import { TFunction } from 'i18next';

import { Badge, BadgeSizes, Button, ButtonLink, ButtonSizes, ITableColumn } from '~components';

export const WORKFLOW_LIST_COLUMNS = (t: TFunction, handleRemove: (workflowStateId: string) => void): ITableColumn[] => [
	{
		id: 'name',
		label: 'Name',
		format: (value, key, item) => (
			<div className="u-display-flex u-align-items-center">
				<span>{value as string}</span> <Badge className='u-margin-left-xs' size={BadgeSizes.SMALL}>{item.slug as string}</Badge>
			</div>
		),
	},
	{
		id: 'technicalState',
		label: 'Technical State',
		format: (value) => <Badge>{value as string}</Badge>,
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex">
				<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} className="u-margin-left-auto">
					<i className="las la-pen"></i> {t(`GENERAL.LABELS.EDIT`)}
				</ButtonLink>
				<Button size={ButtonSizes.SMALL} className="u-margin-left-sm" onClick={() => handleRemove(item.id as string)}>
					<i className="las la-trash"></i>
				</Button>
			</div>
		),
	},
];
