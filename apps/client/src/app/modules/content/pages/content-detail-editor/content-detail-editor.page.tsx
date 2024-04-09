import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router-dom';

import { Button, ButtonTypes, Editor, HTMLButtonTypes, Loading } from '~components';

import { CONTENT_PATHS } from '../../content.routes';

import { CONTENT_TYPE_KINDS_TRANSLATIONS, useContentStore, useContentTypeStore, useHeaderStore } from '~shared';

export const ContentDetailEditorPage = () => {
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const [contentLoading, fetchContent] = useContentStore((state) => [state.contentLoading, state.fetchContent]);
	const [updateContentItem, updateContentItemLoading] = useContentStore((state) => [state.updateContentItem, state.updateContentItemLoading]);
	const [value, setValue] = useState('');
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const { t } = useTranslation();
	const { siteId, kind } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);

	useEffect(() => {
		if (!contentItem) {
			return;
		}

		setValue(JSON.stringify(contentItem?.fields, null, '\t'));
	}, [contentItem]);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`), to: generatePath(CONTENT_PATHS.ROOT, { siteId, kind }) },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
			{ label: 'Debug' },
		]);

		if (!contentItem?.translationId) {
			return;
		}

		fetchContent(siteId!, { translationId: contentItem.translationId });
	}, [contentItem?.translationId]);

	const handleSubmit = useCallback(() => {
		if (!contentItem) {
			return;
		}

		console.log(value, JSON.parse(value));
		updateContentItem(siteId!, contentItem.id, {
			...contentItem,
			fields: JSON.parse(value),
		});
	}, [value]);

	if (!contentType) {
		return null;
	}

	return (
		<Loading loading={contentLoading} text={t(`GENERAL.LOADING`)}>
			<Editor value={value} defaultLanguage="json" onChange={(updatedValue) => updatedValue && setValue(updatedValue)} />
			<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.BUTTON} onClick={handleSubmit}>
				{updateContentItemLoading && <i className="las la-redo-alt la-spin"></i>} Force item
			</Button>
		</Loading>
	);
};
