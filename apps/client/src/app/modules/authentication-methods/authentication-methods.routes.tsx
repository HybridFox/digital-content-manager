import { Navigate, RouteObject } from "react-router-dom";

import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/authentication-methods`;
const DETAIL_PATH = `${ROOT_PATH}/:authenticationMethodId`;

export const AUTHENTICATION_METHOD_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
	DETAIL_INFO: `${DETAIL_PATH}/info`,
	DETAIL_CONFIGURATION: `${DETAIL_PATH}/configuration`,
	DETAIL_ROLE_ASSIGNMENT: `${DETAIL_PATH}/role-assignment`,
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
		children: [
			{
				path: '',
				element: <Navigate to='info' />
			},
			{
				path: AUTHENTICATION_METHOD_PATHS.DETAIL_INFO,
				lazy: async () => ({ Component: (await import('./pages/authentication-method-info/authentication-method-info.page')).AuthenticationMethodInfoPage }),
			},
			{
				path: AUTHENTICATION_METHOD_PATHS.DETAIL_CONFIGURATION,
				lazy: async () => ({ Component: (await import('./pages/authentication-method-configuration/authentication-method-configuration.page')).AuthenticationMethodConfigurationPage }),
			},
			{
				path: AUTHENTICATION_METHOD_PATHS.DETAIL_ROLE_ASSIGNMENT,
				lazy: async () => ({ Component: (await import('./pages/authentication-method-role-assignment/authentication-method-role-assignment.page')).AuthenticationMethodRoleAssignmentPage }),
			},
		]
	},
];
