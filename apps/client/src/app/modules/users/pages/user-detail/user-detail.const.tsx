import { IHeaderTab } from '@ibs/components';
import { generatePath } from 'react-router-dom';
import * as yup from 'yup';
import { TFunction } from 'i18next';

import { USER_PATHS } from '../../users.routes';

export const editUserSchema = yup.object({
	roles: yup.array().of(yup.string().required()).required().min(1),
});

export const USER_DETAIL_TABS = (t: TFunction ,userId: string): IHeaderTab[] => [
	{
		to: generatePath(USER_PATHS.DETAIL_INFO, {
			userId,
		}),
		label: t('USERS.TABS.INFO'),
	},
	{
		to: generatePath(USER_PATHS.DETAIL_ROLES, {
			userId,
		}),
		label: t('USERS.TABS.ROLES'),
	},
	{
		to: generatePath(USER_PATHS.DETAIL_SITES, {
			userId,
		}),
		label: t('USERS.TABS.SITES'),
	},
];
