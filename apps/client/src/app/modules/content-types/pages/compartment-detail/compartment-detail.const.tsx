import * as yup from 'yup';

export const editCompartmentSchema = yup.object({
	name: yup.string().required(),
});
