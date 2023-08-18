import { useEffect } from 'react';
import { getPageParams, getPaginationProps, useHeaderStore, useRoleStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { ROLE_LIST_COLUMNS } from './role-list.const';

export const RoleListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [roles, rolesPagination, rolesLoading, fetchRoles] = useRoleStore((state) => [
		state.roles,
		state.rolesPagination,
		state.rolesLoading,
		state.fetchRoles,
	]);
	const [removeRole] = useRoleStore((state) => [
		state.removeRole
	]);
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.ROLES`) }]);
	}, []);

	useEffect(() => {
		fetchRoles({ ...getPageParams(searchParams) });
	}, [searchParams])

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
				<Pagination
					className="u-margin-top"
					totalPages={rolesPagination?.totalPages}
					number={rolesPagination?.number}
					size={rolesPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
