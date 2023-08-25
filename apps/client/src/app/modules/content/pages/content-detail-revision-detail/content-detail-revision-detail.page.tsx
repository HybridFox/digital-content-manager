import {
	CONTENT_TYPE_KINDS_TRANSLATIONS,
	DATE_FORMAT,
	IAPIError,
	IContentItem,
	WORKFLOW_TECHNICAL_STATES,
	useContentRevisionStore,
	useContentStore,
	useContentTypeStore,
	useHeaderStore,
	useWorkflowStore,
} from '@ibs/shared';
import { useEffect, useMemo } from 'react';
import { FIELD_VIEW_MODE, RenderFields } from '@ibs/forms';
import { Trans, useTranslation } from 'react-i18next';
import { Alert, AlertTypes } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { generatePath, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { CONTENT_PATHS } from '../../content.routes';
import { useWorkflowStateStore } from '../../../workflow/stores/workflow-state';

export const ContentDetailRevisionDetailPage = () => {
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [content] = useContentStore((state) => [state.contentItem]);
	const [contentRevision, contentRevisionLoading, fetchContentRevision] = useContentRevisionStore((state) => [
		state.contentRevision,
		state.contentRevisionLoading,
		state.fetchContentRevision,
	]);
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const [workflow] = useWorkflowStore((state) => [state.workflow]);
	const { t } = useTranslation();
	const { siteId, contentId, revisionId, kind } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const formMethods = useForm<IContentItem>({
		// resolver: yupResolver(editContentItemSchema),
		values: contentItem,
	});

	useEffect(() => {
		fetchContentRevision(siteId!, contentId!, revisionId!);
	}, []);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${contentType?.kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
			{ label: t('BREADCRUMBS.REVISIONS'), to: generatePath(CONTENT_PATHS.DETAIL_REVISIONS, { siteId, contentId, kind }) },
		]);
	}, [contentItem, contentType]);

	return (
		<FormProvider {...formMethods}>
			<Alert closable={false} className='u-margin-bottom' type={AlertTypes.INFO}>
				<Trans i18nKey="CONTENT_DETAIL_REVISION.STATE_AT" values={{ createdAt: dayjs(contentRevision?.createdAt).format(DATE_FORMAT) }} />
			</Alert>
			<form style={{ height: '100%' }}>
				<RenderFields viewMode={FIELD_VIEW_MODE.VIEW} siteId={siteId!} fieldPrefix="fields." fields={contentType?.fields || []} />
			</form>
		</FormProvider>
	);
};
