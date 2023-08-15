import { Navigate, RouteObject } from "react-router-dom";

import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/users`;
const DETAIL_PATH = `${ROOT_PATH}/:userId`;

export const USER_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
	DETAIL_INFO: `${DETAIL_PATH}/info`,
	DETAIL_ROLES: `${DETAIL_PATH}/roles`,
	DETAIL_SITES: `${DETAIL_PATH}/sites`,
}

export const USER_ROUTES: RouteObject[] = [
	{
		path: USER_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/user-list/user-list.page')).UserListPage }),
	},
	{
		path: USER_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/user-detail/user-detail.page')).UserDetailPage }),
		children: [
			{
				path: '',
				element: <Navigate to="info" />
			},
			{
				path: USER_PATHS.DETAIL_INFO,
				lazy: async () => ({ Component: (await import('./pages/user-detail-info/user-detail-info.page')).UserDetailInfoPage }),
			},
			{
				path: USER_PATHS.DETAIL_ROLES,
				lazy: async () => ({ Component: (await import('./pages/user-detail-roles/user-detail-roles.page')).UserDetailRolesPage }),
			},
			{
				path: USER_PATHS.DETAIL_SITES,
				lazy: async () => ({ Component: (await import('./pages/user-detail-sites/user-detail-sites.page')).UserDetailSitesPage }),
			},
		]
	},
	{
		path: USER_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/user-create/user-create.page')).UserCreatePage }),
	},
];
