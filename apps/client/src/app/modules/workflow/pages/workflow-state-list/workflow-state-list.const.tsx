import { Badge, Button, ButtonLink, ButtonSizes, ButtonTypes, ITableColumn } from '@ibs/components';
import { TFunction } from 'i18next';

export const WORKFLOW_LIST_COLUMNS = (t: TFunction, handleRemove: (workflowStateId: string) => void): ITableColumn[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'technicalState',
		label: 'Technical State',
		format: (value) => <Badge>{value as string}</Badge>
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex">
				<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className="u-margin-left-auto">
					<i className="las la-pen"></i> {t(`GENERAL.LABELS.EDIT`)}
				</ButtonLink>
				<Button size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className="u-margin-left-sm" onClick={() => handleRemove(item.id as string)}>
					<i className="las la-trash"></i>
				</Button>
			</div>
		),
	},
];
