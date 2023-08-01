import { CONTENT_TYPE_KINDS_TRANSLATIONS, IAPIError, useContentTypeStore, useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { useEffect } from 'react';
import { RenderFields, TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, HTMLButtonTypes } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';

import { CONTENT_PATHS } from '../../content.routes';
import { useContentStore } from '../../stores/content';

interface EditContentForm {
	name: string;
	fields: Record<string, unknown>;
}

export const ContentDetailFieldsPage = () => {
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [workflow] = useWorkflowStore((state) => [state.workflow]);
	const [updateContentItem, updateContentItemLoading] = useContentStore((state) => [state.updateContentItem, state.updateContentItemLoading]);
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const { t } = useTranslation();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const formMethods = useForm<EditContentForm>({
		// resolver: yupResolver(editFieldSchema),
		values: {
			name: '',
			fields: {},
			...contentItem,
		},
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${contentType?.kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
			{ label: 'Fields' },
		]);
	}, [contentItem, contentType]);

	const onSubmit = (values: EditContentForm) => {
		if (!workflow) {
			return setError('root', {
				message: 'WORKFLOW_MISSING',
			});
		}

		if (!contentType || !contentItem) {
			return setError('root', {
				message: 'CONTENT-TYPE_MISSING',
			});
		}

		updateContentItem(contentItem?.id, {
			...values,
			workflowStateId: contentItem?.workflowStateId,
			contentTypeId: contentItem?.contentTypeId,
		}).catch((error: IAPIError) => {
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
				<div className="u-margin-bottom">
					<TextField name="name" label="Name" />
				</div>
				<div className="u-margin-bottom">
					<RenderFields fieldPrefix="fields." fields={contentType?.fields || []} />
				</div>
				<Button htmlType={HTMLButtonTypes.SUBMIT}>{updateContentItemLoading && <i className="las la-redo-alt la-spin"></i>} Save</Button>
			</form>
		</FormProvider>
	);
};
