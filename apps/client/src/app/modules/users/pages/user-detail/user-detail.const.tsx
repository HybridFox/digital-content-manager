import * as yup from 'yup';

export const editUserSchema = yup.object({
	roles: yup.array().of(yup.string().required()).required().min(1),
});
