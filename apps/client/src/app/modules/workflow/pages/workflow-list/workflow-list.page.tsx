import { useEffect } from 'react';
import { useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { WORKFLOW_LIST_COLUMNS } from './workflow-list.const';

export const WorkflowListPage = () => {
	const [workflows, workflowsLoading, fetchWorkflows] = useWorkflowStore((state) => [
		state.workflows,
		state.workflowsLoading,
		state.fetchWorkflows,
	]);
	const { t } = useTranslation();
	const { kind } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		fetchWorkflows();
		setBreadcrumbs([{ label: t(`BREADCRUMBS.WORKFLOWS`) }]);
	}, [kind]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`WORKFLOWS.TITLES.LIST`)}
				action={
					<ButtonLink to="create">
						<span className="las la-plus"></span> {t(`WORKFLOWS.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={workflowsLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={WORKFLOW_LIST_COLUMNS(t)} rows={workflows || []}></Table>
			</Loading>
		</>
	);
};
