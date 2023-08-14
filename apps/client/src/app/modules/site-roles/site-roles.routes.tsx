import { RouteObject } from "react-router-dom";

import { APP_SITE_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_SITE_ROOT_PATH}/roles`;
const DETAIL_PATH = `${ROOT_PATH}/:roleId`;

export const SITE_ROLE_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
}

export const SITE_ROLE_ROUTES: RouteObject[] = [
	{
		path: SITE_ROLE_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/site-role-list/site-role-list.page')).SiteRoleListPage }),
	},
	{
		path: SITE_ROLE_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/site-role-create/site-role-create.page')).SiteRoleCreatePage }),
	},
	{
		path: SITE_ROLE_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/site-role-detail/site-role-detail.page')).SiteRoleDetailPage }),
	},
];
