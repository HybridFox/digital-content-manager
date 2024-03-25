import * as yup from 'yup';

import { PermissionEffect } from '~shared';

export const createPolicySchema = yup.object({
	name: yup.string().required(),
	permissions: yup.array().of(yup.object({
		effect: yup.string().oneOf([PermissionEffect.DENY, PermissionEffect.GRANT]).required(),
		actions: yup.array().of(yup.string().required()).required(),
		resources: yup.array().of(yup.string().required()).required(),
	})).required()
});
