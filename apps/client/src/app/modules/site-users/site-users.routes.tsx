import { RouteObject } from "react-router-dom";

import { APP_SITE_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_SITE_ROOT_PATH}/users`;
const DETAIL_PATH = `${ROOT_PATH}/:userId`;

export const SITE_USER_PATHS = {
	ROOT: `${ROOT_PATH}`,
	DETAIL: `${DETAIL_PATH}`,
}

export const SITE_USER_ROUTES: RouteObject[] = [
	{
		path: SITE_USER_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/user-list/user-list.page')).UserListPage }),
	},
	{
		path: SITE_USER_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/user-detail/user-detail.page')).UserDetailPage }),
	},
];
