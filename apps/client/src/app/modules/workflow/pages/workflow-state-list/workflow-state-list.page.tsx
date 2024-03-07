import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '~components';

import { useWorkflowStateStore } from '../../stores/workflow-state';

import { WORKFLOW_LIST_COLUMNS } from './workflow-state-list.const';

import { getPageParams, getPaginationProps, useHeaderStore } from '~shared';

export const WorkflowStateListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [workflowStates, workflowStatesPagination, workflowStatesLoading, fetchWorkflowStates] = useWorkflowStateStore((state) => [
		state.workflowStates,
		state.workflowStatesPagination,
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
		setBreadcrumbs([{ label: t(`BREADCRUMBS.WORKFLOW_STATES`) }]);
	}, [siteId]);

	useEffect(() => {
		fetchWorkflowStates(siteId!, { ...getPageParams(searchParams) });
	}, [searchParams])

	const handleRemove = (workflowStateId: string): void => {
		removeWorkflowState(siteId!, workflowStateId).then(() => fetchWorkflowStates(siteId!));
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`WORKFLOW_STATES.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t(`WORKFLOW_STATES.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={workflowStatesLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={WORKFLOW_LIST_COLUMNS(t, handleRemove)} rows={workflowStates || []}></Table>
				<Pagination
					className="u-margin-top"
					totalPages={workflowStatesPagination?.totalPages}
					number={workflowStatesPagination?.number}
					size={workflowStatesPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
