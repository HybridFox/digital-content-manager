import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '~components';

import { CONTENT_TYPE_LIST_COLUMNS } from './ct-list.const';

import { getPageParams, getPaginationProps, useContentTypeStore, useHeaderStore } from '~shared';

export const CTListPage = () => {
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const [contentTypes, contentTypesPagination, contentTypesLoading, fetchContentTypes] =
		useContentTypeStore((state) => [
			state.contentTypes,
			state.contentTypesPagination,
			state.contentTypesLoading,
			state.fetchContentTypes,
		]);
	const [breadcrumbs, setBreadcrumbs] =
		useHeaderStore((state) => [
			state.breadcrumbs,
			state.setBreadcrumbs
		]);

	useEffect(() => {
		setBreadcrumbs([{ label: t('BREADCRUMBS.CONTENT_TYPES') }])
	}, []);

	useEffect(() => {
		fetchContentTypes(siteId!, { ...getPageParams(searchParams) });
	}, [searchParams])

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t('CONTENT_TYPES.TITLES.LIST')}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t('CONTENT_TYPES.ACTIONS.CREATE')}
					</ButtonLink>
				}
			></Header>
			<Loading
				loading={contentTypesLoading}
			>
				<Table
					columns={CONTENT_TYPE_LIST_COLUMNS(t)}
					rows={contentTypes}
				></Table>
				<Pagination
					className="u-margin-top"
					totalPages={contentTypesPagination?.totalPages}
					number={contentTypesPagination?.number}
					size={contentTypesPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
