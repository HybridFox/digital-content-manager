import { useEffect } from 'react';
import { useContentTypeStore, useHeaderStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useParams } from 'react-router-dom';

import { CONTENT_TYPE_LIST_COLUMNS } from './ct-list.const';

export const CTListPage = () => {
	const { siteId } = useParams();
	const [contentTypes, contentTypesLoading, fetchContentTypes] =
		useContentTypeStore((state) => [
			state.contentTypes,
			state.contentTypesLoading,
			state.fetchContentTypes,
		]);
	const [breadcrumbs, setBreadcrumbs] =
		useHeaderStore((state) => [
			state.breadcrumbs,
			state.setBreadcrumbs
		]);

	useEffect(() => {
		fetchContentTypes(siteId!);
		setBreadcrumbs([{ label: 'Content Types' }])
	}, []);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title="All Content Types"
				action={
					<ButtonLink to="create">
						<span className="las la-plus"></span> Create content
						type
					</ButtonLink>
				}
			></Header>
			<Loading
				loading={contentTypesLoading}
				text="Loading content types..."
			>
				<Table
					columns={CONTENT_TYPE_LIST_COLUMNS}
					rows={contentTypes}
				></Table>
			</Loading>
		</>
	);
};
