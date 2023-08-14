import * as yup from 'yup';

export const editUserSchema = yup.object({
	name: yup.string().required(),
	email: yup.string().required(),
	password: yup.string().required(),
	roles: yup.array().of(yup.string().required()).required().min(1),
});
