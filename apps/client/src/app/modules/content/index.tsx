import { Navigate, RouteObject } from 'react-router-dom';

import { CONTENT_PATHS } from './content.routes';

export const CONTENT_ROUTES: RouteObject[] = [
	{
		path: CONTENT_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/content-list/content-list.page')).ContentListPage }),
	},
	{
		path: CONTENT_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/content-create/content-create.page')).ContentCreatePage }),
	},
	{
		path: CONTENT_PATHS.CREATE_DETAIL,
		lazy: async () => ({ Component: (await import('./pages/content-create-detail/content-create-detail.page')).ContentCreateDetailPage }),
	},
];
