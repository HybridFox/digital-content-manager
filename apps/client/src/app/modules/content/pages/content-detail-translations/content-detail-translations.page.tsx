import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router-dom';

import { Loading, Table } from '~components';

import { CONTENT_PATHS } from '../../content.routes';

import { CONTENT_TRANSLATIONS_LIST_COLUMNS } from './content-detail-translations.const';

import { CONTENT_TYPE_KINDS_TRANSLATIONS, useAuthStore, useContentStore, useContentTypeStore, useHeaderStore } from '~shared';

export const ContentDetailTranslationsPage = () => {
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const [content, contentLoading, fetchContent] = useContentStore((state) => [state.content, state.contentLoading, state.fetchContent]);
	const [activeSite] = useAuthStore((state) => [state.activeSite])
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const { t } = useTranslation();
	const { siteId, kind } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`), to: generatePath(CONTENT_PATHS.ROOT, { siteId, kind }) },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
			{ label: 'Translations' }
		]);

		if (!contentItem?.translationId) {
			return;
		}

		fetchContent(siteId!, { translationId: contentItem.translationId });
	}, [contentItem?.translationId]);

	const rows = useMemo(() => {
		if (!activeSite || !contentItem) {
			return [];
		}
		
		return activeSite.languages.map((language) => {
			const foundContentItem = content.find((contentItem) => contentItem.language.id === language.id);

			if (!foundContentItem) {
				return {
					language,
					translationId: contentItem.translationId
				};
			}

			return foundContentItem;
		})
	}, [activeSite, content]);

	if (!contentType) {
		return;
	}

	return (
		<Loading loading={contentLoading} text={t(`GENERAL.LOADING`)}>
			<Table columns={CONTENT_TRANSLATIONS_LIST_COLUMNS(siteId!, kind!, contentType, t)} rows={rows}></Table>
		</Loading>
	);
};
