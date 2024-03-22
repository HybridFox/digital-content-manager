import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import {
	Header,
	Loading,
} from '~components';

import { FIELD_DETAIL_TABS } from './block-detail.const';

import {
	useContentTypeFieldStore,
	useContentTypeStore,
	useFieldBlockStore,
	useHeaderStore,
} from '~shared';

export const BlockDetailPage = () => {
	const [contentType, contentTypeLoading, fetchContentType] =
		useContentTypeStore((state) => [
			state.contentType,
			state.contentTypeLoading,
			state.fetchContentType,
		]);
	const [blockField, blockFieldLoading, fetchBlockField] =
		useFieldBlockStore((state) => [
			state.field,
			state.fieldLoading,
			state.fetchField,
		]);
	const [contentTypeField, contentTypeFieldLoading, fetchContentTypeField] =
		useContentTypeFieldStore((state) => [
			state.field,
			state.fieldLoading,
			state.fetchField,
		]);
	const [breadcrumbs] = useHeaderStore((state) => [state.breadcrumbs]);
	const { siteId, contentTypeId, fieldId, blockId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!contentTypeId || !fieldId || !blockId) {
			return navigate('/not-found');
		}

		fetchBlockField(siteId!, contentTypeId, fieldId, blockId);
		fetchContentTypeField(siteId!, contentTypeId, fieldId);
		fetchContentType(siteId!, contentTypeId);
	}, []);

	return (
		<>
			<Header
				title={
					<>
						Editing block <i>"{blockField?.name || '...'}"</i>
					</>
				}
				tabs={FIELD_DETAIL_TABS(siteId!, contentType, contentTypeField, blockField)}
				breadcrumbs={breadcrumbs}
			></Header>
			<Loading
				text="Content type loading..."
				loading={contentTypeLoading || contentTypeFieldLoading || blockFieldLoading}
			>
				<Outlet />
			</Loading>
		</>
	);
};
