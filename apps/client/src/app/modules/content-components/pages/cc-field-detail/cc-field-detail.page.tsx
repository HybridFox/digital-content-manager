import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import {
	Header,
	Loading,
} from '~components';

import { FIELD_DETAIL_TABS, editFieldSchema } from './cc-field-detail.const';

import {
	useContentComponentFieldStore,
	useContentComponentStore,
	useHeaderStore,
} from '~shared';

export const CCFieldDetailPage = () => {
	const [contentComponent, contentComponentLoading, fetchContentComponent] =
		useContentComponentStore((state) => [
			state.contentComponent,
			state.contentComponentLoading,
			state.fetchContentComponent,
		]);
	const [contentComponentField, contentComponentFieldLoading, fetchContentComponentField] =
		useContentComponentFieldStore((state) => [
			state.field,
			state.fieldLoading,
			state.fetchField,
		]);
	const [breadcrumbs] = useHeaderStore((state) => [state.breadcrumbs]);
	const { contentComponentId, siteId, fieldId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!contentComponentId || !fieldId) {
			return navigate('/not-found');
		}

		fetchContentComponentField(siteId!, contentComponentId, fieldId);
		fetchContentComponent(siteId!, contentComponentId);
	}, []);

	return (
		<>
			<Header
				title={
					<>
						Editing field <i>"{contentComponentField?.name || '...'}"</i>
					</>
				}
				tabs={FIELD_DETAIL_TABS(siteId!, contentComponent, contentComponentField)}
				breadcrumbs={breadcrumbs}
			></Header>
			<Loading
				text="Content type loading..."
				loading={contentComponentLoading || contentComponentFieldLoading}
			>
				<Outlet />
			</Loading>
		</>
	);
};
