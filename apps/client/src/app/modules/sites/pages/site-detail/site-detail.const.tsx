import { TFunction } from 'i18next';
import { generatePath } from 'react-router-dom';
import * as yup from 'yup';

import { IHeaderTab } from '~components';

import { SITE_PATHS } from '../../sites.routes';

export const updateSiteSchema = yup.object({
	name: yup.string().required(),
	languages: yup.array().of(yup.string().required()).required().min(1),
});

export const SITE_DETAIL_TABS = (t: TFunction, rootSiteId: string): IHeaderTab[] => [
	{
		to: generatePath(SITE_PATHS.DETAIL_SETTINGS, {
			rootSiteId,
		}),
		label: t('SITES.TABS.SETTINGS'),
	},
	{
		to: generatePath(SITE_PATHS.DETAIL_CT, {
			rootSiteId,
		}),
		label: t('SITES.TABS.CONTENT_TYPES')
	},
	{
		to: generatePath(SITE_PATHS.DETAIL_MODULES, {
			rootSiteId,
		}),
		label: t('SITES.TABS.MODULES')
	}
];
