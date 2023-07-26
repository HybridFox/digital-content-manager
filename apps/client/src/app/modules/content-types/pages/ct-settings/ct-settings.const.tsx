import * as yup from 'yup';

export const editContentType = yup.object({
	name: yup.string().required(),
	description: yup.string(),
	min: yup.number().required(),
	max: yup.number().required(),
	hidden: yup.boolean().required(),
	multiLanguage: yup.boolean().required(),
});
