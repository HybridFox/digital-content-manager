import { useEffect } from 'react';
import { useHeaderStore, useRoleStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

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
	const { siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		fetchRoles(siteId!);
		setBreadcrumbs([{ label: t(`BREADCRUMBS.ROLES`) }]);
	}, []);

	const handleRemove = (roleId: string): void => {
		removeRole(siteId!, roleId).then(() => fetchRoles(siteId!));
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`ROLES.TITLES.LIST`)}
				action={
					<ButtonLink to="create">
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
