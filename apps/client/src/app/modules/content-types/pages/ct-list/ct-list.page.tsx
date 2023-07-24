import { useEffect } from 'react';
import { useContentTypeStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';

import { CONTENT_TYPE_LIST_COLUMNS } from './ct-list.const';

export const CTListPage = () => {
	const [contentTypes, contentTypesLoading, fetchContentTypes] = useContentTypeStore((state) => [state.contentTypes, state.contentTypesLoading, state.fetchContentTypes]);

	useEffect(() => {
		fetchContentTypes();
	}, []);

	return (
		<>
			<Header
				subTitle="Content Types"
				title="All Content Types"
				action={
					<ButtonLink to="create">
						<span className="las la-plus"></span> Create content
						type
					</ButtonLink>
				}
			></Header>
			<Loading loading={contentTypesLoading} text='Loading content types...'>
				<Table columns={CONTENT_TYPE_LIST_COLUMNS} rows={contentTypes}></Table>
			</Loading>
		</>
	);
};
