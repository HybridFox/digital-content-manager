import { useEffect } from 'react';
import { useHeaderStore, useRoleStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';

import { ROLE_LIST_COLUMNS } from './role-list.const';

export const RoleListPage = () => {
	const [roles, rolesLoading, fetchRoles] = useRoleStore((state) => [
		state.roles,
		state.rolesLoading,
		state.fetchRoles,
	]);
	const [removeRole] = useRoleStore((state) => [
		state.removeRole
	]);
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		fetchRoles();
		setBreadcrumbs([{ label: t(`BREADCRUMBS.ROLES`) }]);
	}, []);

	const handleRemove = (roleId: string): void => {
		removeRole(roleId).then(() => fetchRoles());
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`ROLES.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t(`ROLES.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={rolesLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={ROLE_LIST_COLUMNS(t, handleRemove)} rows={roles || []}></Table>
			</Loading>
		</>
	);
};
