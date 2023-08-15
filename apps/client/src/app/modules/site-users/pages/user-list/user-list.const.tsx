import { Badge, Button, ButtonLink, ButtonSizes, ButtonTypes, ITableColumn } from '@ibs/components';
import { IRole, IUser } from '@ibs/shared';
import { TFunction } from 'i18next';

export const USER_LIST_COLUMNS = (t: TFunction, handleRemove: (workflowStateId: string) => void): ITableColumn<IUser>[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'roles',
		label: 'Roles',
		format: (roles: IRole[]) => roles.map((role) => <Badge className='u-margin-right-xs u-margin-top-xxxs u-margin-bottom-xxxs' key={role.id}>{role.name}</Badge>)
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
