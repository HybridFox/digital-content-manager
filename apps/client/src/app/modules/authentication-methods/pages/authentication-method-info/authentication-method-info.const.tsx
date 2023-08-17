import * as yup from 'yup';

export const editAuthenticationMethodSchema = yup.object({
	name: yup.string().required(),
	active: yup.bool().required(),
	weight: yup.number().required(),
});
