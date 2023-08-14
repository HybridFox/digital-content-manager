import * as yup from 'yup';

export const editAuthenticationMethodSchema = yup.object({
	name: yup.string().required(),
	kind: yup.string().required(),
});
