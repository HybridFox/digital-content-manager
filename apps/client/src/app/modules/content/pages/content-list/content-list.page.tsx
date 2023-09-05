import { useEffect } from 'react';
import {
	CONTENT_TYPE_KINDS_PARAMETER_MAP, getFilterProps,
	getPageParams,
	getPaginationProps,
	useAuthStore,
	useContentStore,
	useHeaderStore
} from '@ibs/shared';
import {ButtonLink, ButtonTypes, Filter, HasPermission, Header, Loading, Pagination, Table} from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import {CONTENT_LIST_COLUMNS, CONTENT_LIST_FILTER} from './content-list.const';

export const ContentListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [content, contentPagination, contentLoading, fetchContent] = useContentStore((state) => [
		state.content,
		state.contentPagination,
		state.contentLoading,
		state.fetchContent,
	]);
	const [activeSite] = useAuthStore((state) => [state.activeSite]);
	const [removeContentItemLoading, removeContentItem] = useContentStore((state) => [state.removeContentItemLoading, state.removeContentItem]);
	const { t } = useTranslation();
	const { kind, siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		if (!kind) {
			return;
		}

		setBreadcrumbs([{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`) }]);
	}, [kind]);

	useEffect(() => {
		fetchContent(siteId!, { kind: CONTENT_TYPE_KINDS_PARAMETER_MAP[kind!], ...getPageParams(searchParams) });
	}, [searchParams, kind]);

	const handleDelete = (contentItemId: string): void => {
		removeContentItem(siteId!, contentItemId).then(() => fetchContent(siteId!, { kind: CONTENT_TYPE_KINDS_PARAMETER_MAP[kind!] }));
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`CONTENT.TITLES.LIST_${kind?.toUpperCase()}`)}
				action={
					<HasPermission siteId={siteId} resource="urn:ibs:*" action={`sites::${kind}:create`}>
						<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
							<span className="las la-plus"></span> {t(`CONTENT.ACTIONS.CREATE_${kind?.toUpperCase()}`)}
						</ButtonLink>
					</HasPermission>
				}
			></Header>
			<Loading loading={contentLoading} text={t(`GENERAL.LOADING`)}>
				<Filter filters={CONTENT_LIST_FILTER(t, activeSite)} siteId={siteId!} className="u-margin-bottom" {...getFilterProps(searchParams, setSearchParams)} />
				<Table columns={CONTENT_LIST_COLUMNS(t, handleDelete)} rows={content || []}></Table>
				<Pagination
					className="u-margin-top"
					totalPages={contentPagination?.totalPages}
					number={contentPagination?.number}
					size={contentPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
