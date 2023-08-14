import { useEffect, useMemo } from 'react';
import { CONTENT_TYPE_KINDS_TRANSLATIONS, IAPIError, useContentTypeStore, useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { Alert, AlertTypes, Button, HTMLButtonTypes } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { RadioField } from '@ibs/forms';
import { useParams } from 'react-router-dom';

import { IContentItem, useContentStore } from '../../stores/content';
import { CONTENT_PATHS } from '../../content.routes';

export const ContentDetailStatusPage = () => {
	const [updateContentItem, updateContentItemLoading] = useContentStore((state) => [state.updateContentItem, state.updateContentItemLoading]);
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const [workflow] = useWorkflowStore((state) => [state.workflow]);
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const formMethods = useForm<IContentItem>({
		values: contentItem
	});

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${contentType?.kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
			{ label: 'Status' }
		]);

		if (!contentType?.workflowId) {
			return;
		}

		// fetchWorkflow(contentType.workflowId);
	}, [contentType?.workflowId]);

	const { handleSubmit, formState: { errors }, setError } = formMethods;

	const options = useMemo(() => {
		return (workflow?.transitions || [])
			.filter((transition) => transition.fromState.id === contentItem?.workflowStateId)
			.map((transition) => ({
				label: transition.toState.name,
				value: transition.toState.id,
			}))
	}, [workflow, contentItem])

	const onSubmit = (values: IContentItem) => {
		if (!contentItem) {
			return;
		}

		updateContentItem(siteId!, contentItem.id, values).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	return (
		<FormProvider {...formMethods}>
			<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
				{errors?.root?.message}
			</Alert>
			<form onSubmit={handleSubmit(onSubmit)}>
				<RadioField name="workflowStateId" fieldConfiguration={{ options }}></RadioField>
				<div className="u-margin-top">
					<Button htmlType={HTMLButtonTypes.SUBMIT}>{updateContentItemLoading && <i className="las la-redo-alt la-spin"></i>} Save</Button>
				</div>
			</form>
		</FormProvider>
	);
};
