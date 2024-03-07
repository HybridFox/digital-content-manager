import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '~components';

import { WORKFLOW_LIST_COLUMNS } from './workflow-list.const';

import { getPageParams, getPaginationProps, useHeaderStore, useWorkflowStore } from '~shared';

export const WorkflowListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [workflows, workflowsPagination, workflowsLoading, fetchWorkflows] = useWorkflowStore((state) => [
		state.workflows,
		state.workflowsPagination,
		state.workflowsLoading,
		state.fetchWorkflows,
	]);
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.WORKFLOWS`) }]);
	}, [siteId]);

	useEffect(() => {
		fetchWorkflows(siteId!, { ...getPageParams(searchParams) });
	}, [searchParams])

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
				<Pagination
					className="u-margin-top"
					totalPages={workflowsPagination?.totalPages}
					number={workflowsPagination?.number}
					size={workflowsPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
