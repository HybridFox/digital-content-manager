import { useEffect } from 'react';
import { useHeaderStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useSiteUserStore } from '../../stores/site-user';

import { USER_LIST_COLUMNS } from './user-list.const';

export const UserListPage = () => {
	const [users, usersLoading, fetchWorkflowStates] = useSiteUserStore((state) => [
		state.users,
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
				// action={
				// 	<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
				// 		<span className="las la-plus"></span> {t(`WORKFLOW_STATES.ACTIONS.CREATE`)}
				// 	</ButtonLink>
				// }
			></Header>
			<Loading loading={usersLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={USER_LIST_COLUMNS(t, handleRemove)} rows={users || []}></Table>
			</Loading>
		</>
	);
};
