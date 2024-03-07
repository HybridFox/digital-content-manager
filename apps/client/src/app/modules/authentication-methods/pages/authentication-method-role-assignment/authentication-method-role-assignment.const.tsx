import { TFunction } from 'i18next';
import * as yup from 'yup';

import { Button, ButtonSizes, ITableColumn } from '~components';

import { IAuthenticationMethodRoleAssignment } from '~shared';

export const addRoleAssignmentSchema = yup.object({
	siteId: yup.string().optional(),
	roleId: yup.string().required(),
});


export const AUTHENTICATION_METHOD_ROLE_ASSIGNMENTS_COLUMNS = (
	t: TFunction,
	handleRemove: (assignmentId: string) => void,
): ITableColumn<IAuthenticationMethodRoleAssignment>[] => [
	{
		id: 'site.name',
		label: 'Site Name',
		format: (value: string | null) => value || <span className="u-text--light u-text--italic">Root</span>
	},
	{
		id: 'role.name',
		label: 'Role Name',
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, site) => {
			return (
				<div className="u-display-flex u-justify-content-end">
					<Button
						size={ButtonSizes.SMALL}
						className="u-margin-left-sm"
						onClick={() => handleRemove(site.id)}
					>
						<i className="las la-trash"></i>
					</Button>
				</div>
			);
		},
	},
];
