import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '~components';

import { CONTENT_COMPONENTS_LIST_COLUMNS } from './cc-list.const';

import { getPageParams, getPaginationProps, useContentComponentStore, useHeaderStore } from '~shared';

export const CCListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [contentComponents, contentComponentsPagination, contentComponentsLoading, fetchContentComponents] = useContentComponentStore((state) => [
		state.contentComponents,
		state.contentComponentsPagination,
		state.contentComponentsLoading,
		state.fetchContentComponents,
	]);
	const [removeContentComponentLoading, removeContentComponent] = useContentComponentStore((state) => [
		state.removeContentComponentLoading,
		state.removeContentComponent
	]);
	const { t } = useTranslation();
	const { kind, siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.CONTENT_COMPONENTS`) }]);
	}, [kind]);

	useEffect(() => {
		fetchContentComponents(siteId!, { ...getPageParams(searchParams) });
	}, [searchParams]);

	const handleDelete = (contentItemId: string): void => {
		removeContentComponent(siteId!, contentItemId).then(() => fetchContentComponents(siteId!, { ...getPageParams(searchParams) }));
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`CONTENT-COMPONENTS.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t(`CONTENT-COMPONENTS.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={contentComponentsLoading} text={t(`GENERAL.LOADING`)}>
				<Table columns={CONTENT_COMPONENTS_LIST_COLUMNS(t, handleDelete, removeContentComponentLoading)} rows={contentComponents}></Table>
				<Pagination
					className="u-margin-top"
					totalPages={contentComponentsPagination?.totalPages}
					number={contentComponentsPagination?.number}
					size={contentComponentsPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
