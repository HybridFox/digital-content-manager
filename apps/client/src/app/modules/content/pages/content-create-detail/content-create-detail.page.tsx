import { CONTENT_TYPE_KINDS_TRANSLATIONS, IAPIError, useContentTypeStore, useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { RenderFields, TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { CONTENT_PATHS } from '../../content.routes';
import { useContentStore } from '../../stores/content';

import { createContentItemSchema } from './content-create-detail.const';

interface CreateContentForm {
	name: string;
	fields: Record<string, unknown>;
}

export const ContentCreateDetailPage = () => {
	const [contentType, contentTypeLoading, fetchContentType] = useContentTypeStore((state) => [
		state.contentType,
		state.contentTypeLoading,
		state.fetchContentType,
	]);
	const [searchParams] = useSearchParams();
	const [workflow, workflowLoading, fetchWorkflow] = useWorkflowStore((state) => [state.workflow, state.workflowLoading, state.fetchWorkflow]);
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
	const formMethods = useForm<CreateContentForm>({
		values: defaultValues,
		resolver: yupResolver(createContentItemSchema) as any,
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		if (!contentTypeId) {
			return;
		}

		fetchContentType(contentTypeId).then((contentType) => fetchWorkflow(contentType.workflowId));
		fetchDefaultValues(searchParams.get('translationId')!);
	}, [contentTypeId]);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`), to: generatePath(CONTENT_PATHS.CREATE, { kind }) },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
		]);
	}, [contentType, kind]);

	const onSubmit = (values: CreateContentForm) => {
		if (!workflow) {
			return setError('root', {
				message: 'WORKFLOW_MISSING',
			});
		}

		if (!contentType) {
			return setError('root', {
				message: 'CONTENT-TYPE_MISSING',
			});
		}

		createContentItem({
			...values,
			workflowStateId: workflow?.defaultWorkflowStateId,
			contentTypeId: contentType?.id,
			languageId: searchParams.get('languageId') || '',
			translationId: searchParams.get('translationId') || undefined,
		})
			.then((contentItem) => navigate(generatePath(CONTENT_PATHS.DETAIL, { kind, contentId: contentItem.id })))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
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
				<Loading loading={contentTypeLoading || workflowLoading || defaultValuesLoading} text="Loading data...">
					<FormProvider {...formMethods}>
						<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
							{errors?.root?.message}
						</Alert>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="u-margin-bottom">
								<TextField name="name" label="Administrative Name" />
							</div>
							<div className="u-margin-bottom">
								<RenderFields fieldPrefix="fields." fields={contentType?.fields || []} />
							</div>
							<Button htmlType={HTMLButtonTypes.SUBMIT}>
								{createContentItemLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
