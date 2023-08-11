import * as yup from 'yup';

export const editWorkflowSchema = yup.object({
	name: yup.string().required(),
});
