import * as yup from 'yup';

export const createSiteSchema = yup.object({
	name: yup.string().required(),
	languages: yup.array().of(yup.string().required()).required().min(1),
});
