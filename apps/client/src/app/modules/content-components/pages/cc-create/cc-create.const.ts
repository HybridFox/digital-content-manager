import * as yup from 'yup';

export const createContentComponentForm = yup.object({
	name: yup.string().min(3).required(),
	description: yup.string().optional(),
	workflowId: yup.string().required(),
});
