import { FC, useEffect } from 'react';
import { IResource, ResourceKind, useAuthStore, useResourceStore, useStorageRepositoryStore } from '@ibs/shared';
import { useTranslation } from 'react-i18next';

import { Loading } from '../loading';
import { Table } from '../table';

import { ExplorerPath } from './components/explorer-path/explorer-path.component';
import { ExplorerRepositories } from './components/explorer-repositories/explorer-repositories.component';
import { RESOURCE_COLUMNS } from './resource-explorer.const';
import { IResourceExplorerProps, ResourceExplorerAction } from './resource-explorer.types';

export const ResourceExplorer: FC<IResourceExplorerProps> = ({
	onChangeConfiguration,
	repositoryId,
	path,
	actions,
	onSelection,
	selection = [],
	minSelection,
	maxSelection
}: IResourceExplorerProps) => {
	const [site] = useAuthStore((state) => [state.activeSite]);
	const [resources, resourcesLoading, fetchResources] = useResourceStore((state) => [
		state.resources,
		state.resourcesLoading,
		state.fetchResources,
	]);
	const [removeDirectoryLoading, removeDirectory] = useResourceStore((state) => [state.removeDirectoryLoading, state.removeDirectory]);
	const [storageRepositories, storageRepositoriesLoading, fetchStorageRepositories] = useStorageRepositoryStore((state) => [
		state.storageRepositories,
		state.storageRepositoriesLoading,
		state.fetchStorageRepositories,
	]);
	const { t } = useTranslation();

	const handleSelection = (selection: string[]) => {
		if (!onSelection || !repositoryId) {
			return;
		}

		onSelection(selection.map((path) => ({
			path,
			storageRepositoryId: repositoryId
		})))
	} 

	useEffect(() => {
		fetchStorageRepositories().then(([repository]) => {
			if (repositoryId) {
				return;
			}

			onChangeConfiguration(repository.id, path);
		});
	}, []);

	useEffect(() => {
		if (!repositoryId) {
			return;
		}

		fetchResources(repositoryId, { path: path });
	}, [path, repositoryId]);

	const evaluatePath = (path: string) => {
		return path.replace(/^\//, '');
	};

	const onSubNavigate = (subDirectory: string) => {
		if (!repositoryId) {
			return;
		}

		const newPath = [...path.split('/'), subDirectory];
		onChangeConfiguration(repositoryId, evaluatePath(newPath.join('/')));
	};

	const onNavigate = (newPath: string) => {
		if (!repositoryId) {
			return;
		}

		onChangeConfiguration(repositoryId, evaluatePath(newPath));
	};

	const handleRemoveDirectory = async (name: string) => {
		if (!repositoryId) {
			return;
		}

		await removeDirectory(repositoryId, path, name);
	};

	const handleRemoveFile = async (name: string) => {
		if (!repositoryId) {
			return;
		}

		await removeDirectory(repositoryId, path, name);
	};

	const mapResource = (resource: IResource) => ({
		id: `${path}/${resource.name}`,
		...resource,
	});

	return (
		<>
			<ExplorerRepositories
				className="u-margin-bottom"
				repositories={storageRepositories || []}
				onSelect={(id) => {
					onChangeConfiguration(id, '');
				}}
				selectedRepositoryId={repositoryId}
			/>
			<ExplorerPath className="u-margin-bottom" onNavigate={onNavigate} path={path.split('/')} />
			<Loading loading={resourcesLoading} text={t(`GENERAL.LOADING`)}>
				<Table
					minSelection={minSelection}
					maxSelection={maxSelection}
					selection={selection.map(({ path }) => path)}
					selectable={actions.includes(ResourceExplorerAction.SELECT)}
					selectablePredicate={(row: IResource) => row.kind === ResourceKind.FILE}
					columns={RESOURCE_COLUMNS(site?.id || null, path.split('/'), actions, onSubNavigate, handleRemoveDirectory, handleRemoveFile)}
					rows={(resources || []).map(mapResource)}
					onSelection={handleSelection}
				></Table>
			</Loading>
		</>
	);
};
