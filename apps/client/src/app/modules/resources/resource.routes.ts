import { RouteObject } from 'react-router-dom';

import { APP_SITE_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_SITE_ROOT_PATH}/resources`;
const DETAIL_PATH = `${ROOT_PATH}/:storageEngineId`;

export const RESOURCE_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
}

export const RESOURCE_ROUTES: RouteObject[] = [
	{
		path: RESOURCE_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/resource-list/resource-list.page')).ResourceListPage }),
	},
];
