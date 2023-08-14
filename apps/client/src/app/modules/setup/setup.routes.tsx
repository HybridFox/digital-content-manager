import { RouteObject } from 'react-router-dom';

export const APP_SITE_ROOT_PATH = "/app";


export const SETUP_PATHS = {
	SETUP: `/setup`,
}

export const SETUP_ROUTES: RouteObject[] = [
	{
		path: SETUP_PATHS.SETUP,
		lazy: async () => ({ Component: (await import('./pages/setup/setup.page')).SetupPage }),
	},
];
