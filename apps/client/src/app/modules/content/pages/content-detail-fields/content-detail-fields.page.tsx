import {
	CONTENT_TYPE_KINDS_TRANSLATIONS,
	IAPIError,
	IContentItem,
	useContentStore,
	useContentTypeStore,
	useHeaderStore,
	useWorkflowStore,
} from '@ibs/shared';
import { useEffect, useMemo } from 'react';
import { RadioField, RenderFields } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import cx from 'classnames/bind';

import { CONTENT_PATHS } from '../../content.routes';

import styles from './content-detail-fields.module.scss';

const cxBind = cx.bind(styles);

export const ContentDetailFieldsPage = () => {
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [content] = useContentStore((state) => [state.contentItem]);
	const [updateContentItem, updateContentItemLoading] = useContentStore((state) => [state.updateContentItem, state.updateContentItemLoading]);
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const [workflow] = useWorkflowStore((state) => [state.workflow]);
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const formMethods = useForm<IContentItem>({
		// resolver: yupResolver(editFieldSchema),
		values: contentItem,
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

	const statusOptions = useMemo(() => {
		return (workflow?.transitions || [])
			.filter((transition) => transition.fromState.id === contentItem?.workflowStateId)
			.map((transition) => ({
				label: transition.toState.name,
				value: transition.toState.id,
			}))
	}, [workflow, contentItem])

	return (
		<FormProvider {...formMethods}>
			<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
				{errors?.root?.message}
			</Alert>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={cxBind('p-content-detail')}>
					<div className={cxBind('p-content-detail__fields')}>
						<RenderFields siteId={siteId!} fieldPrefix="fields." fields={contentType?.fields || []} />
					</div>
					<div className={cxBind('p-content-detail__status')}>
						<p>Current status: {content?.currentWorkflowState?.name}</p>
						<RadioField name="workflowStateId" fieldConfiguration={{ options: statusOptions }}></RadioField>
						<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
							{updateContentItemLoading && <i className="las la-redo-alt la-spin"></i>} Save
						</Button>
					</div>
				</div>
			</form>
		</FormProvider>
	);
};
