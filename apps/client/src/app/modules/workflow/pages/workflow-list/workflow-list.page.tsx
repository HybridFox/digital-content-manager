import { useEffect } from 'react';
import { useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, Header, Loading, Table } from '@ibs/components';
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
	const { siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		fetchWorkflows(siteId!);
		setBreadcrumbs([{ label: t(`BREADCRUMBS.WORKFLOWS`) }]);
	}, [siteId]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`WORKFLOWS.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
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
