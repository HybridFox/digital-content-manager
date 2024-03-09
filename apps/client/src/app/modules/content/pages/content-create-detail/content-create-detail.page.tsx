import { useEffect } from 'react';
import { generatePath, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


import { Header, Loading } from '~components';

import { CONTENT_PATHS } from '../../content.routes';
import { ContentForm, ContentFormMode } from '../../components';
import { useWorkflowStateStore } from '../../../workflow/stores/workflow-state';

import { CONTENT_TYPE_KINDS_TRANSLATIONS, useContentStore, useContentTypeStore, useHeaderStore, useWorkflowStore } from '~shared';

interface CreateContentForm {
	name: string;
	slug: string;
	fields: Record<string, unknown>;
}

export const ContentCreateDetailPage = () => {
	const [contentType, contentTypeLoading, fetchContentType] = useContentTypeStore((state) => [
		state.contentType,
		state.contentTypeLoading,
		state.fetchContentType,
	]);
	const { siteId } = useParams();
	const [searchParams] = useSearchParams();
	const [workflow, workflowLoading, fetchWorkflow] = useWorkflowStore((state) => [state.workflow, state.workflowLoading, state.fetchWorkflow]);
	const [workflowStates, workflowStatesLoading, fetchWorkflowStates] = useWorkflowStateStore((state) => [
		state.workflowStates,
		state.workflowStatesLoading,
		state.fetchWorkflowStates,
	]);
	const navigate = useNavigate();
	const [createContentItem, createContentItemLoading] = useContentStore((state) => [state.createContentItem, state.createContentItemLoading]);
	const { t } = useTranslation();
	const [defaultValues, defaultValuesLoading, fetchDefaultValues] = useContentStore((state) => [
		state.defaultValues,
		state.defaultValuesLoading,
		state.fetchDefaultValues,
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { kind, contentTypeId } = useParams();

	useEffect(() => {
		if (!contentTypeId || !siteId) {
			return;
		}

		fetchContentType(siteId!, contentTypeId).then((contentType) => fetchWorkflow(siteId!, contentType.workflowId));
		fetchWorkflowStates(siteId!, { pagesize: -1 });

		if (searchParams.get('translationId')) {
			fetchDefaultValues(siteId!, searchParams.get('translationId')!);
		}
	}, [contentTypeId, siteId]);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`), to: generatePath(CONTENT_PATHS.ROOT, { siteId, kind }) },
			{ label: t(`BREADCRUMBS.CREATE`), to: generatePath(CONTENT_PATHS.CREATE, { kind, siteId }) },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
		]);
	}, [contentType, kind]);

	const handleSubmit = (values: CreateContentForm) => {
		if (!workflow) {
			return;
		}

		if (!contentType) {
			return;
		}

		createContentItem(siteId!, {
			...values,
			fields: values.fields,
			workflowStateId: workflow?.defaultWorkflowStateId,
			contentTypeId: contentType?.id,
			languageId: searchParams.get('languageId') || '',
			translationId: searchParams.get('translationId') || undefined,
		}).then((contentItem) => navigate(generatePath(CONTENT_PATHS.DETAIL, { kind, contentId: contentItem.id, siteId })));
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={
					<>
						Create content <i>"{contentType?.name}"</i>
					</>
				}
			></Header>
			<div className="u-margin-top">
				<Loading loading={contentTypeLoading || workflowLoading || defaultValuesLoading || workflowStatesLoading} text="Loading data...">
					<ContentForm
						onSubmit={handleSubmit}
						mode={ContentFormMode.CREATE}
						contentItem={defaultValues}
						workflow={workflow}
						workflowStates={workflowStates}
						loading={createContentItemLoading}
						fields={contentType?.fields || []}
					/>
				</Loading>
			</div>
		</>
	);
};
