import * as yup from 'yup';

import { StorageKinds } from '~shared';

export const createStorageRepositorySchema = yup.object({
	name: yup.string().required(),
	kind: yup.string().required().oneOf([StorageKinds.LOCAL_FS, StorageKinds.S3_BUCKET, StorageKinds.FTP]),
	configuration: yup.object().optional()
});
