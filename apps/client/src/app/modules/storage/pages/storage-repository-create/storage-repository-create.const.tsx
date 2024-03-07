import * as yup from 'yup';

import { STORAGE_KINDS } from '~shared';

export const createStorageRepositorySchema = yup.object({
	name: yup.string().required(),
	kind: yup.string().required().oneOf([STORAGE_KINDS.LOCAL_FS, STORAGE_KINDS.S3_BUCKET]),
	configuration: yup.object().optional()
});
