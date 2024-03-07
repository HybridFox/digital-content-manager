import { TFunction } from 'i18next';
import { generatePath } from 'react-router-dom';


import { IHeaderTab } from '~components';

import { AUTHENTICATION_METHOD_PATHS } from '../../authentication-methods.routes';
import { AUTHENTICATION_METHOD_FIELDS } from '../../authentication-methods.const';

import { AUTHENTICATION_METHOD_KINDS } from '~shared';

export const AUTHENTICATION_METHOD_DETAIL_TABS = (t: TFunction, authenticationMethodId: string, authenticationMethodKind: AUTHENTICATION_METHOD_KINDS): IHeaderTab[] => [
	{
		to: generatePath(AUTHENTICATION_METHOD_PATHS.DETAIL_INFO, {
			authenticationMethodId,
		}),
		label: t('AUTHENTICATION_METHODS.TABS.INFO'),
	},
	{
		to: generatePath(AUTHENTICATION_METHOD_PATHS.DETAIL_CONFIGURATION, {
			authenticationMethodId,
		}),
		label: t('AUTHENTICATION_METHODS.TABS.CONFIGURATION'),
		disabled: (AUTHENTICATION_METHOD_FIELDS[authenticationMethodKind] || []).length === 0
	},
	{
		to: generatePath(AUTHENTICATION_METHOD_PATHS.DETAIL_ROLE_ASSIGNMENT, {
			authenticationMethodId,
		}),
		label: t('AUTHENTICATION_METHODS.TABS.ROLE_ASSIGNMENT'),
	},
];
