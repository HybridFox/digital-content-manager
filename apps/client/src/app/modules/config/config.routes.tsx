import { Navigate, RouteObject } from "react-router-dom";

import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/config`;

export const CONFIG_PATHS = {
	ROOT: `${ROOT_PATH}`
}

export const CONFIG_ROUTES: RouteObject[] = [
	{
		path: CONFIG_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/config-detail/config-detail.page')).ConfigDetailPage }),
	}
];
