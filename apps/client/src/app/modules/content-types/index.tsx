import { Navigate, RouteObject } from 'react-router-dom';

import { CTListPage } from './pages/ct-list/ct-list.page';
import { CTCreatePage } from './pages/ct-create/ct-create.page';
import { CTDetailPage } from './pages/ct-detail/ct-detail.page';
import { FieldDetailPage } from './pages/field-detail/field-detail.page';
import { CTContentComponentsPage } from './pages/ct-content-components/ct-content-components.page';
import { CTSettingsPage } from './pages/ct-settings/ct-settings.page';
import { FieldSettingsPage } from './pages/field-settings/field-settings.page';
import { CONTENT_TYPES_PATHS } from './content-types.routes';
import { FieldConfigurationPage } from './pages/field-configuration/field-configuration.page';

export const CONTENT_TYPES_ROUTES: RouteObject[] = [
	{
		path: CONTENT_TYPES_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/ct-list/ct-list.page')).CTListPage }),
	},
	{
		path: CONTENT_TYPES_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/ct-create/ct-create.page')).CTCreatePage }),
	},
	{
		path: CONTENT_TYPES_PATHS.DETAIL,
		children: [
			{
				path: '',
				lazy: async () => ({ Component: (await import('./pages/ct-detail/ct-detail.page')).CTDetailPage }),
				children: [
					{
						path: '',
						element: <Navigate replace to="content-components" />,
					},
					{
						path: CONTENT_TYPES_PATHS.DETAIL_SETTINGS,
						lazy: async () => ({ Component: (await import('./pages/ct-settings/ct-settings.page')).CTSettingsPage }),
					},
					{
						path: CONTENT_TYPES_PATHS.DETAIL_CC,
						lazy: async () => ({ Component: (await import('./pages/ct-content-components/ct-content-components.page')).CTContentComponentsPage }),
					},
				],
			},
			{
				path: CONTENT_TYPES_PATHS.FIELD_DETAIL,
				lazy: async () => ({ Component: (await import('./pages/field-detail/field-detail.page')).FieldDetailPage }),
				children: [
					{
						path: '',
						element: <Navigate replace to="configuration" />,
					},
					{
						path: CONTENT_TYPES_PATHS.FIELD_DETAIL_SETTINGS,
						lazy: async () => ({ Component: (await import('./pages/field-settings/field-settings.page')).FieldSettingsPage }),
					},
					{
						path: CONTENT_TYPES_PATHS.FIELD_DETAIL_CONFIGURATION,
						lazy: async () => ({ Component: (await import('./pages/field-configuration/field-configuration.page')).FieldConfigurationPage }),
					}
				]
			},
		],
	},
];
