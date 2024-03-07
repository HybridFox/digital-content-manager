import { TFunction } from 'i18next';

import { Button, ButtonLink, ButtonSizes, ButtonTypes, ITableColumn } from '~components';

import { IWorkflowTransition } from '~shared';

export const WORKFLOW_LIST_COLUMNS = (t: TFunction): ITableColumn[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'transitions',
		label: 'Transitions',
		format: (value) => (value as IWorkflowTransition[]).length
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex">
				<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} className="u-margin-left-auto">
					<i className="las la-pen"></i> {t(`GENERAL.LABELS.EDIT`)}
				</ButtonLink>
				<Button size={ButtonSizes.SMALL} className="u-margin-left-sm">
					<i className="las la-trash"></i>
				</Button>
			</div>
		),
	},
];
