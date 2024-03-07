import * as yup from 'yup';

import { WORKFLOW_TECHNICAL_STATES } from '~shared';

export const createWorkflowStateSchema = yup.object({
	name: yup.string().required(),
	description: yup.string().optional().nullable(),
	technicalState: yup.string().required().oneOf([WORKFLOW_TECHNICAL_STATES.DRAFT, WORKFLOW_TECHNICAL_STATES.PUBLISHED]),
});
