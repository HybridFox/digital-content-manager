import { RouteObject } from "react-router-dom";

import { APP_SITE_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_SITE_ROOT_PATH}/webhooks`;
const DETAIL_PATH = `${ROOT_PATH}/:webhookId`;

export const WEBHOOKS_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
}

export const WEBHOOKS_ROUTES: RouteObject[] = [
	{
		path: WEBHOOKS_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/webhook-list/webhook-list.page')).WebhookListPage }),
	},
	{
		path: WEBHOOKS_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/webhook-create/webhook-create.page')).WebhookCreatePage }),
	},
	{
		path: WEBHOOKS_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/storage-repository-detail/webhook-detail.page')).WebhookDetailPage }),
	},
];
