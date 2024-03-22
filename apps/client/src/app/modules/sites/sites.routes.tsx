import { Navigate, RouteObject } from "react-router-dom";

import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/sites`;
const DETAIL_PATH = `${ROOT_PATH}/:rootSiteId`;

export const SITE_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
	DETAIL_SETTINGS: `${DETAIL_PATH}/settings/info`,
	DETAIL_CT: `${DETAIL_PATH}/settings/content-types`,
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
		children: [
			{
				path: '',
				element: <Navigate to='settings/info' />
			},
			{
				path: SITE_PATHS.DETAIL_SETTINGS,
				lazy: async () => ({ Component: (await import('./pages/site-detail-settings/site-detail-settings.page')).SiteDetailSettingsPage }),
			},
			{
				path: SITE_PATHS.DETAIL_CT,
				lazy: async () => ({ Component: (await import('./pages/site-detail-ct/site-detail-ct.page')).SiteDetailCTPage }),
			},
		]
	},
];
