import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useSearchParams } from 'react-router-dom';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading, Table, Pagination } from '~components';

import { SITE_PATHS } from '../../sites.routes';
import { useSiteStore } from '../../stores/site';

import { CONTENT_TYPE_LIST_COLUMNS } from './site-detail-ct.const';

import { SelectField, TextField } from '~forms';
import {
	getPageParams,
	getPaginationProps,
	IAPIError,
	useContentTypeStore,
	useHeaderStore,
	useLanguageStore,
	useRootContentTypeStore,
} from '~shared';

interface UpdateSiteForm {
	name: string;
	languages: string[];
}

export const SiteDetailCTPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [contentTypes, contentTypesLoading, fetchContentTypes] = useContentTypeStore((state) => [
		state.contentTypes,
		state.contentTypesLoading,
		state.fetchContentTypes,
	]);
	const [rootContentTypes, rootContentTypesLoading, rootContentTypesPagination, fetchRootContentTypes] = useRootContentTypeStore((state) => [
		state.rootContentTypes,
		state.rootContentTypesLoading,
		state.rootContentTypesPagination,
		state.fetchRootContentTypes,
	]);
	const [enableContentTypeLoading, enableContentType] = useRootContentTypeStore((state) => [
		state.enableContentTypeLoading,
		state.enableContentType,
	]);
	const [disableContentTypeLoading, disableContentType] = useRootContentTypeStore((state) => [
		state.disableContentTypeLoading,
		state.disableContentType,
	]);
	const [site] = useSiteStore((state) => [state.site]);
	const { rootSiteId } = useParams();
	const { t } = useTranslation();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.SITES`), to: SITE_PATHS.ROOT }, { label: site?.name }, { label: t(`BREADCRUMBS.CONTENT_TYPES`) }]);
	}, []);

	useEffect(() => {
		fetchContentTypes(rootSiteId!, { pagesize: -1 });
	}, [rootSiteId]);

	useEffect(() => {
		fetchRootContentTypes({ ...getPageParams(searchParams), siteId: rootSiteId });
	}, [searchParams]);

	const handleEnableContentType = async (contentTypeId: string): Promise<void> => {
		await enableContentType(contentTypeId, rootSiteId!);
		fetchContentTypes(rootSiteId!, { pagesize: -1 });
	}

	const handleDisableContentType = async (contentTypeId: string): Promise<void> => {
		await disableContentType(contentTypeId, rootSiteId!);
		fetchContentTypes(rootSiteId!, { pagesize: -1 });
	}

	return (
		<Loading loading={rootContentTypesLoading}>
			<Table
				columns={CONTENT_TYPE_LIST_COLUMNS(
					t,
					contentTypes,
					handleEnableContentType,
					enableContentTypeLoading,
					handleDisableContentType,
					disableContentTypeLoading
				)}
				rows={rootContentTypes}
			></Table>
			<Pagination
				className="u-margin-top"
				totalPages={rootContentTypesPagination?.totalPages}
				number={rootContentTypesPagination?.number}
				size={rootContentTypesPagination?.size}
				{...getPaginationProps(searchParams, setSearchParams)}
			/>
		</Loading>
	);
};
