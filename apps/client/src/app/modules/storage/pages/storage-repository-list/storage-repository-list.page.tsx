import { useEffect } from 'react';
import { getPageParams, getPaginationProps, useHeaderStore, useStorageRepositoryStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { STORAGE_REPOSITORIES_LIST_COLUMNS } from './storage-repository-list.const';

export const StorageRepositoryListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [storageRepositories, storageRepositoriesPagination, storageRepositoriesLoading, fetchStorageRepositories] = useStorageRepositoryStore((state) => [
		state.storageRepositories,
		state.storageRepositoriesPagination,
		state.storageRepositoriesLoading,
		state.fetchStorageRepositories,
	]);
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.STORAGE_REPOSITORIES`) }]);
	}, [siteId]);

	useEffect(() => {
		fetchStorageRepositories(siteId!, { ...getPageParams(searchParams) });
	}, [searchParams, siteId]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`STORAGE_REPOSITORIES.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t(`STORAGE_REPOSITORIES.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={storageRepositoriesLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={STORAGE_REPOSITORIES_LIST_COLUMNS(t)} rows={storageRepositories || []}></Table>
				<Pagination
					className="u-margin-top"
					totalPages={storageRepositoriesPagination?.totalPages}
					number={storageRepositoriesPagination?.number}
					size={storageRepositoriesPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
