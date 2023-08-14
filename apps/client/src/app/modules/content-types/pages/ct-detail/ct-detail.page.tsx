import { useEffect } from 'react';
import { useContentTypeStore, useHeaderStore } from '@ibs/shared';
import { Header, Loading } from '@ibs/components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { CONTENT_TYPE_DETAIL_TABS } from './ct-detail.const';

export const CTDetailPage = () => {
	const [contentType, contentTypeLoading, fetchContentType] = useContentTypeStore((state) => [state.contentType, state.contentTypeLoading, state.fetchContentType]);
	const [breadcrumbs] = useHeaderStore((state) => [state.breadcrumbs]);
	const { siteId, contentTypeId, } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!contentTypeId) {
			return navigate('/not-found');
		}

		fetchContentType(siteId!, contentTypeId);
	}, []);

	return (
		<>
			<Header
				title={<>Editing content type <i>"{contentType?.name || '...'}"</i></>}
				tabs={CONTENT_TYPE_DETAIL_TABS}
				breadcrumbs={breadcrumbs}
			></Header>
			<Loading text='Content type loading...' loading={contentTypeLoading}>
				<Outlet />
			</Loading>
		</>
	);
};
