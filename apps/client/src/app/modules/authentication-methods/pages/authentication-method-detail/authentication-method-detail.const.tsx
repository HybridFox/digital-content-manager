import * as yup from 'yup';

export const editAuthenticationMethodSchema = yup.object({
	name: yup.string().required(),
	configuration: yup.object().optional(),
	active: yup.bool().required(),
	weight: yup.number().required(),
});
