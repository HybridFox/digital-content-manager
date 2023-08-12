import { STORAGE_KINDS } from '@ibs/shared';
import * as yup from 'yup';

export const createStorageRepositorySchema = yup.object({
	name: yup.string().required(),
	kind: yup.string().required().oneOf([STORAGE_KINDS.LOCAL_FS, STORAGE_KINDS.S3_BUCKET]),
	configuration: yup.object().optional()
});
