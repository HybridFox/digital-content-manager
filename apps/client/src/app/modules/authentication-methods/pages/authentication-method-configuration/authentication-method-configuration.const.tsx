import * as yup from 'yup';

export const editAuthenticationMethodSchema = yup.object({
	configuration: yup.object().optional(),
});
