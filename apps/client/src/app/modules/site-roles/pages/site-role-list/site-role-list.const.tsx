import { Badge, Button, ButtonLink, ButtonSizes, ButtonTypes, ITableColumn } from '@ibs/components';
import { IIAMPolicy, IRole } from '@ibs/shared';
import { TFunction } from 'i18next';

export const ROLE_LIST_COLUMNS = (t: TFunction, handleRemove: (workflowStateId: string) => void): ITableColumn<IRole>[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'policies',
		label: 'Policies',
		format: (policies: IIAMPolicy[]) => policies.map((policy) => <Badge className='u-margin-right-xs u-margin-top-xxxs u-margin-bottom-xxxs' key={policy.id}>{policy.name}</Badge>)
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
