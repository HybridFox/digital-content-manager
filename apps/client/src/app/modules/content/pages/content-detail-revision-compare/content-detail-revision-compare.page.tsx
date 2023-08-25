import {
	CONTENT_TYPE_KINDS_TRANSLATIONS,
	IContentRevision,
	useContentRevisionStore,
	useContentStore,
	useContentTypeStore,
	useHeaderStore,
} from '@ibs/shared';
import { useEffect } from 'react';
import { FIELD_VIEW_MODE, RenderComparison } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { generatePath, useParams } from 'react-router-dom';
import cx from 'classnames/bind'

import { CONTENT_PATHS } from '../../content.routes';

import styles from './content-detail-revision.compare.module.scss';

const cxBind = cx.bind(styles);

export const ContentDetailRevisionComparePage = () => {
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [contentRevisionComparison, contentRevisionComparisonLoading, fetchContentRevisionComparison] = useContentRevisionStore((state) => [
		state.contentRevisionComparison,
		state.contentRevisionComparisonLoading,
		state.fetchContentRevisionComparison,
	]);
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const { t } = useTranslation();
	const { siteId, contentId, firstRevisionId, secondRevisionId, kind } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const formMethods = useForm<[IContentRevision, IContentRevision]>({
		values: contentRevisionComparison,
	});

	useEffect(() => {
		fetchContentRevisionComparison(siteId!, contentId!, firstRevisionId!, secondRevisionId!);
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
		<Loading loading={contentRevisionComparisonLoading}>
			<div className={cxBind("p-revision-compare")}>

			</div>
			<FormProvider {...formMethods}>
				<RenderComparison viewMode={FIELD_VIEW_MODE.VIEW} siteId={siteId!} fieldPrefix="fields." fields={contentType?.fields || []} />
			</FormProvider>
		</Loading>
	);
};
