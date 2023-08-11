import { RouteObject } from "react-router-dom";

import { APP_ROOT_PATH } from "../core/routes.const"

const USERS_ROOT_PATH = `${APP_ROOT_PATH}/users`;
const USERS_DETAIL_PATH = `${USERS_ROOT_PATH}/:userId`;

export const USER_PATHS = {
	USERS_ROOT: `${USERS_ROOT_PATH}`,
	USERS_DETAIL: `${USERS_DETAIL_PATH}`,
}

export const USERS_ROUTES: RouteObject[] = [
	{
		path: USER_PATHS.USERS_ROOT,
		lazy: async () => ({ Component: (await import('./pages/user-list/user-list.page')).UserListPage }),
	},
	{
		path: USER_PATHS.USERS_DETAIL,
		lazy: async () => ({ Component: (await import('./pages/user-detail/user-detail.page')).UserDetailPage }),
	},
];
