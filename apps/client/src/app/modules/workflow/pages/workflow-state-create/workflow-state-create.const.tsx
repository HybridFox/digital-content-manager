import * as yup from 'yup';

import { WorkflowTechnicalStates } from '~shared';

export const createWorkflowStateSchema = yup.object({
	name: yup.string().required(),
	description: yup.string().optional().nullable(),
	technicalState: yup.string().required().oneOf([WorkflowTechnicalStates.DRAFT, WorkflowTechnicalStates.PUBLISHED]),
});
