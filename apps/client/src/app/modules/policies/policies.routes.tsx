import { RouteObject } from "react-router-dom";

import { APP_SITE_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_SITE_ROOT_PATH}/policies`;
const DETAIL_PATH = `${ROOT_PATH}/:policyId`;

export const POLICY_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
}

export const POLICY_ROUTES: RouteObject[] = [
	{
		path: POLICY_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/policy-list/policy-list.page')).PolicyListPage }),
	},
	{
		path: POLICY_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/policy-detail/policy-detail.page')).PolicyDetailPage }),
	},
	{
		path: POLICY_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/policy-create/policy-create.page')).PolicyCreatePage }),
	},
];
