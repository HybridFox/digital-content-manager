import { CONTENT_TYPE_KINDS_TRANSLATIONS, IAPIError, useContentStore, useContentTypeStore, useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, ButtonTypes, Card, HTMLButtonTypes, Header, Loading, RenderFields } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import slugify from 'slugify';

import { CONTENT_PATHS } from '../../content.routes';

import { createContentItemSchema } from './content-create-detail.const';

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
		watch,
		setValue
	} = formMethods;

	const name = watch('name');

	useEffect(() => {
		setValue('slug', slugify((name || '').toLowerCase()))
	}, [name])

	useEffect(() => {
		if (!contentTypeId || !siteId) {
			return;
		}

		fetchContentType(siteId!, contentTypeId).then((contentType) => fetchWorkflow(siteId!, contentType.workflowId));

		if (searchParams.get('translationId')) {
			fetchDefaultValues(siteId!, searchParams.get('translationId')!);
		}
	}, [contentTypeId, siteId]);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`), to: generatePath(CONTENT_PATHS.CREATE, { kind, siteId }) },
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

		createContentItem(siteId!, {
			...values,
			fields: {},
			workflowStateId: workflow?.defaultWorkflowStateId,
			contentTypeId: contentType?.id,
			languageId: searchParams.get('languageId') || '',
			translationId: searchParams.get('translationId') || undefined,
		})
			.then((contentItem) => navigate(generatePath(CONTENT_PATHS.DETAIL, { kind, contentId: contentItem.id, siteId })))
			.catch((error: IAPIError) => {
				setError('root', {
					message: t(`API_MESSAGES.${error.code}`)
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
							<Card className='u-margin-bottom' title='Metadata'>
								<div className="u-row">
									<div className="u-col-md-8">
										<TextField name="name" label="Administrative Name" />
									</div>
									<div className="u-col-md-4">
										<TextField name="slug" label="Slug" />
									</div>
								</div>
							</Card>
							{/* <div className="u-margin-bottom">
								<RenderFields siteId={siteId!} fieldPrefix="fields." fields={contentType?.fields || []} />
							</div> */}
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{createContentItemLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
