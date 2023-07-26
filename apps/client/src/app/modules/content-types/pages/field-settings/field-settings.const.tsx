import * as yup from 'yup';

export const editContentType = yup.object({
	name: yup.string().required(),
	description: yup.string(),
});
