import { PERMISSION_EFFECT } from '@ibs/shared';
import * as yup from 'yup';

export const updateRoleSchema = yup.object({
	name: yup.string().required(),
});
