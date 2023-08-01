import { useContentTypeStore, useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Header, Loading } from '@ibs/components';

import { useContentStore } from '../../stores/content';

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
	const { contentId } = useParams();
	const { kind } = useParams();

	useEffect(() => {
		if (!contentId) {
			return;
		}

		fetchContentItem(contentId)
			.then((contentItem) => fetchContentType(contentItem.contentTypeId))
			.then((contentType) => fetchWorkflow(contentType.workflowId))
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
				tabs={CONTENT_DETAIL_TABS(kind, contentItem)}
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
