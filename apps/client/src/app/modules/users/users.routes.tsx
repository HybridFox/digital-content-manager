import { RouteObject } from "react-router-dom";

import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/users`;
const DETAIL_PATH = `${ROOT_PATH}/:userId`;

export const USER_PATHS = {
	ROOT: `${ROOT_PATH}`,
	DETAIL: `${DETAIL_PATH}`,
}

export const USER_ROUTES: RouteObject[] = [
	{
		path: USER_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/user-list/user-list.page')).UserListPage }),
	},
	{
		path: USER_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/user-detail/user-detail.page')).UserDetailPage }),
	},
];
