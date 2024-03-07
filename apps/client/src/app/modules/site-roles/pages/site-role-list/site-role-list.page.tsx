import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '~components';

import { ROLE_LIST_COLUMNS } from './site-role-list.const';

import { getPageParams, getPaginationProps, useHeaderStore, useSiteRoleStore } from '~shared';

export const SiteRoleListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [roles, rolesPagination, rolesLoading, fetchRoles] = useSiteRoleStore((state) => [
		state.roles,
		state.rolesPagination,
		state.rolesLoading,
		state.fetchRoles,
	]);
	const [removeRole] = useSiteRoleStore((state) => [
		state.removeRole
	]);
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.SITE_ROLES`) }]);
	}, []);

	useEffect(() => {
		fetchRoles(siteId!, { ...getPageParams(searchParams) });
	}, [searchParams]);

	const handleRemove = (roleId: string): void => {
		removeRole(siteId!, roleId).then(() => fetchRoles(siteId!));
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`SITE_ROLES.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t(`SITE_ROLES.ACTIONS.CREATE`)}
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
