import * as yup from 'yup';

export const createContentTypeForm = yup.object({
	name: yup.string().min(5).required(),
	description: yup.string().optional(),
	kind: yup.string().required(),
	workflowId: yup.string().required(),
});
