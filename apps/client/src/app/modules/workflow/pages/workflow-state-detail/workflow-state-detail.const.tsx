import { WORKFLOW_TECHNICAL_STATES } from '@ibs/shared';
import * as yup from 'yup';

export const editWorkflowStateSchema = yup.object({
	name: yup.string().required(),
	description: yup.string().optional().nullable(),
	technicalState: yup.string().required().oneOf([WORKFLOW_TECHNICAL_STATES.DRAFT, WORKFLOW_TECHNICAL_STATES.PUBLISHED]),
});
