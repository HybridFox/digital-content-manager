import * as yup from 'yup';

export const createRoleSchema = yup.object({
	name: yup.string().required(),
	policies: yup.array().of(yup.string().required()).required().min(1),
});
