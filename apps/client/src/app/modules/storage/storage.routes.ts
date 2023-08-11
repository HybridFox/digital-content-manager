import { RouteObject } from "react-router-dom";

import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/storage-repositories`;
const DETAIL_PATH = `${ROOT_PATH}/:storageRepositoryId`;

export const STORAGE_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
}

export const STORAGE_ROUTES: RouteObject[] = [
	{
		path: STORAGE_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/storage-repository-list/storage-repository-list.page')).StorageRepositoryListPage }),
	},
	{
		path: STORAGE_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/storage-repository-create/storage-repository-create.page')).StorageRepositoryCreatePage }),
	},
	{
		path: STORAGE_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/storage-repository-detail/storage-repository-detail.page')).StorageRepositoryDetailPage }),
	},
];
