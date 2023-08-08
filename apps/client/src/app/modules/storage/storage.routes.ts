import { RouteObject } from 'react-router-dom';

import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/storage-engines`;
const DETAIL_PATH = `${ROOT_PATH}/:storageEngineId`;

export const STORAGE_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
}

export const STORAGE_ROUTES: RouteObject[] = [
	{
		path: STORAGE_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/storage-list/storage-list.page')).ContentListPage }),
	},
	{
		path: STORAGE_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/storage-create/content-create.page')).ContentCreateDetailPage }),
	},
	{
		path: STORAGE_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/storage-detail/storage-detail.page')).ContentCreateDetailPage }),
	},
];
