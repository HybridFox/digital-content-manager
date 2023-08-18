import { useEffect } from 'react';
import { getPageParams, getPaginationProps, useHeaderStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { useUserStore } from '../../stores/user';

import { USER_LIST_COLUMNS } from './user-list.const';

export const UserListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [users, usersPagination, usersLoading, fetchUsers] = useUserStore((state) => [
		state.users,
		state.usersPagination,
		state.usersLoading,
		state.fetchUsers,
	]);
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.USERS`) }]);
	}, []);

	useEffect(() => {
		fetchUsers({ ...getPageParams(searchParams) });
	}, [searchParams])

	const handleRemove = (workflowStateId: string): void => {
		// removeWorkflowState(workflowStateId).then(() => fetchUsers());
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`USERS.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t(`USERS.ACTIONS.CREATE`)}
					</ButtonLink>
				}
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
