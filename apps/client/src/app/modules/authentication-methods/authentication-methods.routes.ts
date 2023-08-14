import { RouteObject } from "react-router-dom";

import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/authentication-methods`;
const DETAIL_PATH = `${ROOT_PATH}/:authenticationMethodId`;

export const AUTHENTICATION_METHOD_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
}

export const AUTHENTICATION_METHOD_ROUTES: RouteObject[] = [
	{
		path: AUTHENTICATION_METHOD_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/storage-repository-list/authentication-method-list.page')).AuthenticationMethodListPage }),
	},
	{
		path: AUTHENTICATION_METHOD_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/authentication-method-create/authentication-method-create.page')).AuthenticationMethodCreatePage }),
	},
	{
		path: AUTHENTICATION_METHOD_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/authentication-method-detail/authentication-method-detail.page')).AuthenticationMethodDetailPage }),
	},
];
