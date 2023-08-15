import { Badge, Button, ButtonLink, ButtonSizes, ButtonTypes, ITableColumn } from '@ibs/components';
import { IRole, ISite, IUser } from '@ibs/shared';
import { TFunction } from 'i18next';

export const USER_SITES_COLUMNS = (
	t: TFunction,
	userSites: ISite[],
	handleRemove: (siteId: string) => void,
	handleSelectRoles: (siteId: string) => void
): ITableColumn<ISite>[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'roles',
		label: 'Roles',
		format: (value, key, site) => {
			const userSite = userSites.find(({ id }) => id === site.id);

			if (!userSite) {
				return <span className="u-text--light u-text--italic">No permissions</span>;
			}

			return userSite.roles.map((role) => (
				<Badge className="u-margin-right-xs u-margin-top-xxxs u-margin-bottom-xxxs" key={role.id}>
					{role.name}
				</Badge>
			));
		},
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, site) => {
			const userSite = userSites.find(({ id }) => id === site.id);

			if (!userSite) {
				return (
					<div className="u-display-flex u-justify-content-end">
						<Button onClick={() => handleSelectRoles(site.id)} size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY}>
							<i className="las la-plus"></i> {t(`GENERAL.LABELS.SELECT_ROLES`)}
						</Button>
					</div>
				);
			}

			return (
				<div className="u-display-flex u-justify-content-end">
					<Button onClick={() => handleSelectRoles(site.id)} size={ButtonSizes.SMALL}>
						<i className="las la-pen"></i> {t(`GENERAL.LABELS.SELECT_ROLES`)}
					</Button>
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
