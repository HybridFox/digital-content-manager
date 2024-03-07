import { TFunction } from "i18next";
import { generatePath } from "react-router-dom";


import { IHeaderTab } from "~components";

import { WORKFLOW_PATHS } from "../../workflow.routes";

import { IWorkflow } from "~shared";

export const WORKFLOW_DETAIL_TABS = (t: TFunction, siteId: string, workflow?: IWorkflow): IHeaderTab[] => [
	{
		to: generatePath(WORKFLOW_PATHS.WORKFLOWS_DETAIL_SETTINGS, {
			workflowId: workflow?.id || '',
			siteId,
		}),
		label: 'Settings',
	},
	{
		to: generatePath(WORKFLOW_PATHS.WORKFLOWS_DETAIL_TRANSITIONS, {
			workflowId: workflow?.id || '',
			siteId,
		}),
		label: 'Transitions',
	},
];
