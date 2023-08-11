import * as yup from 'yup';

export const editStorageRepositorySchema = yup.object({
	name: yup.string().required(),
	configuration: yup.object().optional()
});
