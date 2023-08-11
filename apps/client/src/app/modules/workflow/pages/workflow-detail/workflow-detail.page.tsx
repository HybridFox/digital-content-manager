import { useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Header, Loading } from '@ibs/components';
import { Trans, useTranslation } from 'react-i18next';

import { WORKFLOW_DETAIL_TABS } from './workflow-detail.constant';


export const WorkflowDetailPage = () => {
	const { t } = useTranslation();
	const [workflow, workflowLoading, fetchWorkflow] = useWorkflowStore((state) => [
		state.workflow,
		state.workflowLoading,
		state.fetchWorkflow,
	]);
	const [breadcrumbs] = useHeaderStore((state) => [state.breadcrumbs]);
	const { workflowId } = useParams();

	useEffect(() => {
		if (!workflowId) {
			return;
		}

		fetchWorkflow(workflowId);
	}, [workflowId]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={
					<Trans t={t} i18nKey="WORKFLOWS.TITLES.EDIT" values={{ workflowName: workflow?.name }} />
				}
				tabs={WORKFLOW_DETAIL_TABS(t, workflow)}
			></Header>
			<div className="u-margin-top">
				<Loading loading={workflowLoading} text="Loading data...">
					<Outlet />
				</Loading>
			</div>
		</>
	);
};
