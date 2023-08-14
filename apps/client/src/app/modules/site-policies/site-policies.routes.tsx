import { RouteObject } from "react-router-dom";

import { APP_SITE_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_SITE_ROOT_PATH}/policies`;
const DETAIL_PATH = `${ROOT_PATH}/:policyId`;

export const SITE_POLICY_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
}

export const SITE_POLICY_ROUTES: RouteObject[] = [
	{
		path: SITE_POLICY_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/site-policy-list/site-policy-list.page')).SitePolicyListPage }),
	},
	{
		path: SITE_POLICY_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/site-policy-detail/site-policy-detail.page')).SitePolicyDetailPage }),
	},
	{
		path: SITE_POLICY_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/site-policy-create/site-policy-create.page')).SitePolicyCreatePage }),
	},
];
