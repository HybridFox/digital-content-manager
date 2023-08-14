import { RouteObject } from "react-router-dom";

import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/sites`;
const DETAIL_PATH = `${ROOT_PATH}/:rootSiteId`;

export const SITE_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
}

export const SITE_ROUTES: RouteObject[] = [
	{
		path: SITE_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/site-list/site-list.page')).SiteListPage }),
	},
	{
		path: SITE_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/site-create/site-create.page')).SiteCreatePage }),
	},
	{
		path: SITE_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/site-detail/site-detail.page')).SiteDetailPage }),
	},
];
