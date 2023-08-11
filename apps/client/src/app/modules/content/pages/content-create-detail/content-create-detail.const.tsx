import * as yup from 'yup';

export const createContentItemSchema = yup.object({
	name: yup.string().required(),
});
