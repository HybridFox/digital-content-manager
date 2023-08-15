import * as yup from 'yup';

export const editUserSchema = yup.object({
	name: yup.string().required(),
	email: yup.string().email().required(),
	password: yup.string().optional().nullable()
});
