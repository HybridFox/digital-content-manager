import { useEffect, useMemo, useState } from 'react';
import {
	CONTENT_TYPE_KINDS_TRANSLATIONS,
	getPageParams,
	getPaginationProps,
	useAuthStore,
	useContentRevisionStore,
	useContentStore,
	useContentTypeStore,
	useHeaderStore,
} from '@ibs/shared';
import { Button, ButtonLink, ButtonTypes, Loading, Pagination, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams, useSearchParams } from 'react-router-dom';

import { CONTENT_PATHS } from '../../content.routes';

import { CONTENT_TRANSLATIONS_LIST_COLUMNS } from './content-detail-revisions.const';

export const ContentDetailRevisionsPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const [contentRevisions, contentRevisionsPagination, contentRevisionsLoading, fetchContentRevisions] = useContentRevisionStore((state) => [
		state.contentRevisions,
		state.contentRevisionsPagination,
		state.contentRevisionsLoading,
		state.fetchContentRevisions,
	]);
	const [activeSite] = useAuthStore((state) => [state.activeSite]);
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const { t } = useTranslation();
	const { siteId, kind, contentId } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const [revisionSelection, setRevisionSelection] = useState<string[]>([]);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${contentType?.kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
			{ label: t('BREADCRUMBS.REVISIONS') },
		]);

		fetchContentRevisions(siteId!, contentId!, { ...getPageParams(searchParams) });
	}, [searchParams]);

	return (
		<Loading loading={contentRevisionsLoading} text={t(`GENERAL.LOADING`)}>
			<div className="u-margin-bottom">
				<ButtonLink
					to={generatePath(CONTENT_PATHS.DETAIL_REVISION_COMPARE, {
						siteId,
						contentId,
						kind,
						firstRevisionId: contentItem?.revisionId || '',
						secondRevisionId: revisionSelection[0] || '',
					})}
					disabled={revisionSelection.length !== 1}
					type={ButtonTypes.SECONDARY}
				>
					<span className="las la-file-import"></span> {t('REVISIONS.COMPARE_TO_CURRENT')}
				</ButtonLink>
				<ButtonLink
					to={generatePath(CONTENT_PATHS.DETAIL_REVISION_COMPARE, {
						siteId,
						contentId,
						kind,
						firstRevisionId: revisionSelection[0] || '',
						secondRevisionId: revisionSelection[1] || '',
					})}
					className="u-margin-left-xs"
					disabled={revisionSelection.length !== 2}
					type={ButtonTypes.SECONDARY}
				>
					<span className="las la-copy"></span> {t('REVISIONS.COMPARE_EACH_OTHER')}
				</ButtonLink>
			</div>
			<Table
				columns={CONTENT_TRANSLATIONS_LIST_COLUMNS(siteId!, kind!, contentId!, revisionSelection, t)}
				rows={contentRevisions}
				selectable={true}
				onSelection={(selection) => setRevisionSelection(selection)}
				selection={revisionSelection}
				maxSelection={2}
			></Table>
			<Pagination
				className="u-margin-top"
				totalPages={contentRevisionsPagination?.totalPages}
				number={contentRevisionsPagination?.number}
				size={contentRevisionsPagination?.size}
				{...getPaginationProps(searchParams, setSearchParams)}
			/>
		</Loading>
	);
};
