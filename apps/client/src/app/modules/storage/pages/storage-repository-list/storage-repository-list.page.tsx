import { useEffect } from 'react';
import { useHeaderStore, useStorageRepositoryStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { STORAGE_REPOSITORIES_LIST_COLUMNS } from './storage-repository-list.const';

export const StorageRepositoryListPage = () => {
	const [storageRepositories, storageRepositoriesLoading, fetchStorageRepositories] = useStorageRepositoryStore((state) => [
		state.storageRepositories,
		state.storageRepositoriesLoading,
		state.fetchStorageRepositories,
	]);
	const { t } = useTranslation();
	const { kind } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		console.log(kind);
		fetchStorageRepositories();
		setBreadcrumbs([{ label: t(`BREADCRUMBS.STORAGE_REPOSITORIES`) }]);
	}, [kind]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`STORAGE_REPOSITORIES.TITLES.LIST`)}
				action={
					<ButtonLink to="create">
						<span className="las la-plus"></span> {t(`STORAGE_REPOSITORIES.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={storageRepositoriesLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={STORAGE_REPOSITORIES_LIST_COLUMNS(t)} rows={storageRepositories || []}></Table>
			</Loading>
		</>
	);
};
