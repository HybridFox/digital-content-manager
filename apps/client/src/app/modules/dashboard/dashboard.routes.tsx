import { RouteObject } from "react-router-dom";

import { APP_SITE_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_SITE_ROOT_PATH}/dashboard`;

export const DASHBOARD_PATHS = {
	ROOT: `${ROOT_PATH}`,
}

export const DASHBOARD_ROUTES: RouteObject[] = [
	{
		path: DASHBOARD_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/dashboard/dashboard.page')).DashboardPage }),
	},
];
