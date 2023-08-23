import { useContentStore, useContentTypeStore, useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Header, Loading } from '@ibs/components';

import { CONTENT_DETAIL_TABS } from './content-detail.const';

export const ContentDetailPage = () => {
	const [contentTypeLoading, fetchContentType] = useContentTypeStore((state) => [
		state.contentTypeLoading,
		state.fetchContentType,
	]);
	const [workflowLoading, fetchWorkflow] = useWorkflowStore((state) => [
		state.workflowLoading,
		state.fetchWorkflow,
	]);
	const [contentItem, contentItemLoading, fetchContentItem] = useContentStore((state) => [state.contentItem, state.contentItemLoading, state.fetchContentItem]);
	const [breadcrumbs,] = useHeaderStore((state) => [state.breadcrumbs]);
	const { kind, siteId, contentId } = useParams();

	useEffect(() => {
		if (!contentId) {
			return;
		}

		fetchContentItem(siteId!, contentId)
			.then((contentItem) => fetchContentType(siteId!, contentItem.contentTypeId))
			.then((contentType) => fetchWorkflow(siteId!, contentType.workflowId))
	}, [contentId]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={
					<>
						Edit content <i>"{contentItem?.name || '...'}"</i>
					</>
				}
				tabs={CONTENT_DETAIL_TABS(siteId!, kind, contentItem)}
				metaInfo={contentItem?.language.key.toUpperCase()}
			></Header>
			<div className="u-margin-top">
				<Loading loading={contentItemLoading || contentTypeLoading || workflowLoading} text="Loading data...">
					<Outlet />
				</Loading>
			</div>
		</>
	);
};
