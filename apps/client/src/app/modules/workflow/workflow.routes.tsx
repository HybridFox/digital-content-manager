import { Navigate, RouteObject } from "react-router-dom";

import { APP_SITE_ROOT_PATH } from "../core/routes.const"

const WORKFLOWS_ROOT_PATH = `${APP_SITE_ROOT_PATH}/workflows`;
const WORKFLOWS_DETAIL_PATH = `${WORKFLOWS_ROOT_PATH}/:workflowId`;

const WORKFLOW_STATES_ROOT_PATH = `${APP_SITE_ROOT_PATH}/workflow-states`;
const WORKFLOW_STATES_DETAIL_PATH = `${WORKFLOW_STATES_ROOT_PATH}/:workflowStateId`;

export const WORKFLOW_PATHS = {
	WORKFLOWS_ROOT: `${WORKFLOWS_ROOT_PATH}`,
	WORKFLOWS_CREATE: `${WORKFLOWS_ROOT_PATH}/create`,
	WORKFLOWS_DETAIL: `${WORKFLOWS_DETAIL_PATH}`,
	WORKFLOWS_DETAIL_SETTINGS: `${WORKFLOWS_DETAIL_PATH}/settings`,
	WORKFLOWS_DETAIL_TRANSITIONS: `${WORKFLOWS_DETAIL_PATH}/transitions`,

	WORKFLOW_STATES_ROOT: `${WORKFLOW_STATES_ROOT_PATH}`,
	WORKFLOW_STATES_CREATE: `${WORKFLOW_STATES_ROOT_PATH}/create`,
	WORKFLOW_STATES_DETAIL: `${WORKFLOW_STATES_DETAIL_PATH}`,
}

export const WORKFLOW_ROUTES: RouteObject[] = [
	{
		path: WORKFLOW_PATHS.WORKFLOWS_ROOT,
		lazy: async () => ({ Component: (await import('./pages/workflow-list/workflow-list.page')).WorkflowListPage }),
	},
	// {
	// 	path: WORKFLOW_PATHS.WORKFLOWS_CREATE,
	// 	lazy: async () => ({ Component: (await import('./pages/storage-repository-create/storage-repository-create.page')).StorageRepositoryCreatePage }),
	// },
	{
		path: WORKFLOW_PATHS.WORKFLOWS_DETAIL,
		lazy: async () => ({ Component: (await import('./pages/workflow-detail/workflow-detail.page')).WorkflowDetailPage }),
		children: [
			{
				path: '',
				element: <Navigate to="transitions" />
			},
			{
				path: WORKFLOW_PATHS.WORKFLOWS_DETAIL_SETTINGS,
				lazy: async () => ({ Component: (await import('./pages/workflow-detail-settings/workflow-detail-settings.page')).WorkflowDetailSettingsPage }),
			},
			{
				path: WORKFLOW_PATHS.WORKFLOWS_DETAIL_TRANSITIONS,
				lazy: async () => ({ Component: (await import('./pages/workflow-detail-transitions/workflow-detail-transitions.page')).WorkflowDetailTransitionsPage }),
			}
		]
	},

	{
		path: WORKFLOW_PATHS.WORKFLOW_STATES_ROOT,
		lazy: async () => ({ Component: (await import('./pages/workflow-state-list/workflow-state-list.page')).WorkflowStateListPage }),
	},
	{
		path: WORKFLOW_PATHS.WORKFLOW_STATES_CREATE,
		lazy: async () => ({ Component: (await import('./pages/workflow-state-create/workflow-state-create.page')).WorkflowStateCreatePage }),
	},
	{
		path: WORKFLOW_PATHS.WORKFLOW_STATES_DETAIL,
		lazy: async () => ({ Component: (await import('./pages/workflow-state-detail/workflow-state-detail.page')).WorkflowStateDetailPage }),
	},
];
