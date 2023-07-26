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
		element: <CTListPage />,
	},
	{
		path: CONTENT_TYPES_PATHS.CREATE,
		element: <CTCreatePage />,
	},
	{
		path: CONTENT_TYPES_PATHS.DETAIL,
		children: [
			{
				path: '',
				element: <CTDetailPage />,
				children: [
					{
						path: '',
						element: <Navigate replace to="content-components" />,
					},
					{
						path: CONTENT_TYPES_PATHS.DETAIL_SETTINGS,
						element: <CTSettingsPage />,
					},
					{
						path: CONTENT_TYPES_PATHS.DETAIL_CC,
						element: <CTContentComponentsPage />,
					},
				],
			},
			{
				path: CONTENT_TYPES_PATHS.FIELD_DETAIL,
				element: <FieldDetailPage />,
				children: [
					{
						path: '',
						element: <Navigate replace to="configuration" />,
					},
					{
						path: CONTENT_TYPES_PATHS.FIELD_DETAIL_SETTINGS,
						element: <FieldSettingsPage />
					},
					{
						path: CONTENT_TYPES_PATHS.FIELD_DETAIL_CONFIGURATION,
						element: <FieldConfigurationPage />
					}
				]
			},
		],
	},
];
