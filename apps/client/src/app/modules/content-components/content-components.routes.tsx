import { Navigate, RouteObject } from "react-router-dom";

import { APP_SITE_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_SITE_ROOT_PATH}/content-components`;
const DETAIL_PATH = `${ROOT_PATH}/:contentComponentId`;
const FIELD_DETAIL_PATH = `${DETAIL_PATH}/fields/:fieldId`;

export const CONTENT_COMPONENT_PATHS = {
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

export const CONTENT_COMPONENT_ROUTES: RouteObject[] = [
	{
		path: CONTENT_COMPONENT_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/cc-list/cc-list.page')).CCListPage }),
	},
	{
		path: CONTENT_COMPONENT_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/cc-create/cc-create.page')).CCCreatePage }),
	},
	{
		path: CONTENT_COMPONENT_PATHS.DETAIL,
		children: [
			{
				path: '',
				lazy: async () => ({ Component: (await import('./pages/cc-detail/cc-detail.page')).CCDetailPage }),
				children: [
					{
						path: '',
						element: <Navigate replace to="content-components" />,
					},
					{
						path: CONTENT_COMPONENT_PATHS.DETAIL_SETTINGS,
						lazy: async () => ({ Component: (await import('./pages/cc-settings/cc-settings.page')).CCSettingsPage }),
					},
					{
						path: CONTENT_COMPONENT_PATHS.DETAIL_CC,
						lazy: async () => ({ Component: (await import('./pages/cc-content-components/cc-content-components.page')).CCContentComponentsPage }),
					},
				],
			},
			{
				path: CONTENT_COMPONENT_PATHS.FIELD_DETAIL,
				lazy: async () => ({ Component: (await import('./pages/cc-field-detail/cc-field-detail.page')).CCFieldDetailPage }),
				children: [
					{
						path: '',
						element: <Navigate replace to="settings" />,
					},
					{
						path: CONTENT_COMPONENT_PATHS.FIELD_DETAIL_SETTINGS,
						lazy: async () => ({ Component: (await import('./pages/cc-field-settings/cc-field-settings.page')).CCFieldSettingsPage }),
					},
					{
						path: CONTENT_COMPONENT_PATHS.FIELD_DETAIL_CONFIGURATION,
						lazy: async () => ({ Component: (await import('./pages/cc-field-configuration/cc-field-configuration.page')).CCFieldConfigurationPage }),
					},
					{
						path: CONTENT_COMPONENT_PATHS.FIELD_DETAIL_VALIDATION,
						lazy: async () => ({ Component: (await import('./pages/cc-field-validation/cc-field-validation.page')).CCFieldValidationPage }),
					}
				]
			},
		],
	},
];
