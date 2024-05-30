import * as yup from 'yup';

export const configSchema = yup.object({
	name: yup.string().required(),
});
