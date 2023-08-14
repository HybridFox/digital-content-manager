import * as yup from 'yup';

export const updateRoleSchema = yup.object({
	name: yup.string().required(),
	policies: yup.array().of(yup.string().required()).required().min(1),
});
