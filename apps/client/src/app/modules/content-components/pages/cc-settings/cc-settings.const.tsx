import * as yup from 'yup';

export const editContentComponent = yup.object({
	name: yup.string().required(),
	description: yup.string()
});
