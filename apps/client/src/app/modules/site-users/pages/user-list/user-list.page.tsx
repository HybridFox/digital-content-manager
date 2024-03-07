import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { Header, Loading, Pagination, Table } from '~components';

import { useSiteUserStore } from '../../stores/site-user';

import { USER_LIST_COLUMNS } from './user-list.const';

import { getPaginationProps, useHeaderStore } from '~shared';

export const UserListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [users, usersPagination, usersLoading, fetchWorkflowStates] = useSiteUserStore((state) => [
		state.users,
		state.usersPagination,
		state.usersLoading,
		state.fetchUsers,
	]);
	const { t } = useTranslation();
	const { kind, siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		fetchWorkflowStates(siteId!);
		setBreadcrumbs([{ label: t(`BREADCRUMBS.SITE_USERS`) }]);
	}, [kind]);

	const handleRemove = (workflowStateId: string): void => {
		// removeWorkflowState(workflowStateId).then(() => fetchWorkflowStates());
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`SITE_USERS.TITLES.LIST`)}
			></Header>
			<Loading loading={usersLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={USER_LIST_COLUMNS(t, handleRemove)} rows={users || []}></Table>
				<Pagination
					className="u-margin-top"
					totalPages={usersPagination?.totalPages}
					number={usersPagination?.number}
					size={usersPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
