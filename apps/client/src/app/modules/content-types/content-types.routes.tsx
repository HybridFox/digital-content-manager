import { Navigate, RouteObject } from "react-router-dom";

import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/content-types`;
const DETAIL_PATH = `${ROOT_PATH}/:contentTypeId`;
const FIELD_DETAIL_PATH = `${DETAIL_PATH}/fields/:fieldId`;

export const CONTENT_TYPES_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
	DETAIL_SETTINGS: `${DETAIL_PATH}/settings`,
	DETAIL_CC: `${DETAIL_PATH}/content-components`,

	FIELD_DETAIL: `${FIELD_DETAIL_PATH}`,
	FIELD_DETAIL_SETTINGS: `${FIELD_DETAIL_PATH}/settings`,
	FIELD_DETAIL_CONFIGURATION: `${FIELD_DETAIL_PATH}/configuration`,
	FIELD_DETAIL_VALIDATION: `${FIELD_DETAIL_PATH}/validation`,
	FIELD_DETAIL_DEFAULT_VALUE: `${FIELD_DETAIL_PATH}/default-value`,
}

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
						element: <Navigate replace to="settings" />,
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
