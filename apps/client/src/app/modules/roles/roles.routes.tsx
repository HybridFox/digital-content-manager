import { RouteObject } from "react-router-dom";

import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/roles`;
const DETAIL_PATH = `${ROOT_PATH}/:roleId`;

export const ROLE_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
}

export const ROLES_ROUTES: RouteObject[] = [
	{
		path: ROLE_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/role-list/role-list.page')).RoleListPage }),
	},
	{
		path: ROLE_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/role-create/role-create.page')).RoleCreatePage }),
	},
	{
		path: ROLE_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/role-detail/role-detail.page')).RoleDetailPage }),
	},
];
