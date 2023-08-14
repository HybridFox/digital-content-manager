import { useEffect } from 'react';
import { useHeaderStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useWorkflowStateStore } from '../../stores/workflow-state';

import { WORKFLOW_LIST_COLUMNS } from './workflow-state-list.const';

export const WorkflowStateListPage = () => {
	const [workflowStates, workflowStatesLoading, fetchWorkflowStates] = useWorkflowStateStore((state) => [
		state.workflowStates,
		state.workflowStatesLoading,
		state.fetchWorkflowStates,
	]);
	const [removeWorkflowState] = useWorkflowStateStore((state) => [
		state.removeWorkflowState
	]);
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		fetchWorkflowStates(siteId!);
		setBreadcrumbs([{ label: t(`BREADCRUMBS.WORKFLOW_STATES`) }]);
	}, [siteId]);

	const handleRemove = (workflowStateId: string): void => {
		removeWorkflowState(siteId!, workflowStateId).then(() => fetchWorkflowStates(siteId!));
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
			<Loading loading={workflowStatesLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={WORKFLOW_LIST_COLUMNS(t, handleRemove)} rows={workflowStates || []}></Table>
			</Loading>
		</>
	);
};
