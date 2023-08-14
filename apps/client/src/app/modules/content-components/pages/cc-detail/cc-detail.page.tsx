import { useEffect } from 'react';
import { useContentComponentStore, useHeaderStore } from '@ibs/shared';
import { Header, Loading } from '@ibs/components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { CONTENT_TYPE_DETAIL_TABS } from './cc-detail.const';

export const CCDetailPage = () => {
	const [contentComponent, contentComponentLoading, fetchContentComponent] = useContentComponentStore((state) => [
		state.contentComponent,
		state.contentComponentLoading,
		state.fetchContentComponent,
	]);
	const [breadcrumbs] = useHeaderStore((state) => [state.breadcrumbs]);
	const { siteId, contentComponentId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!contentComponentId) {
			return navigate('/not-found');
		}

		fetchContentComponent(siteId!, contentComponentId);
	}, []);

	return (
		<>
			<Header
				title={
					<>
						Editing content component <i>"{contentComponent?.name || '...'}"</i>
					</>
				}
				tabs={CONTENT_TYPE_DETAIL_TABS}
				breadcrumbs={breadcrumbs}
			></Header>
			<Loading text="Content component loading..." loading={contentComponentLoading}>
				<Outlet />
			</Loading>
		</>
	);
};
