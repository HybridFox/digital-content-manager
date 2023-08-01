import * as yup from 'yup';

export const editContentComponentField = yup.object({
	name: yup.string().required(),
	description: yup.string(),
});
