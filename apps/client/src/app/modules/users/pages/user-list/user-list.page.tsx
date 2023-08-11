import { useEffect } from 'react';
import { useHeaderStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useUserStore } from '../../stores/user';

import { USER_LIST_COLUMNS } from './user-list.const';

export const UserListPage = () => {
	const [users, usersLoading, fetchWorkflowStates] = useUserStore((state) => [
		state.users,
		state.usersLoading,
		state.fetchUsers,
	]);
	// const [removeWorkflowState] = useWorkflowStateStore((state) => [
	// 	state.removeWorkflowState
	// ]);
	const { t } = useTranslation();
	const { kind } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		fetchWorkflowStates();
		setBreadcrumbs([{ label: t(`BREADCRUMBS.USERS`) }]);
	}, [kind]);

	const handleRemove = (workflowStateId: string): void => {
		// removeWorkflowState(workflowStateId).then(() => fetchWorkflowStates());
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`WORKFLOW_STATES.TITLES.LIST`)}
				action={
					<ButtonLink to="create">
						<span className="las la-plus"></span> {t(`WORKFLOW_STATES.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={usersLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={USER_LIST_COLUMNS(t, handleRemove)} rows={users || []}></Table>
			</Loading>
		</>
	);
};
