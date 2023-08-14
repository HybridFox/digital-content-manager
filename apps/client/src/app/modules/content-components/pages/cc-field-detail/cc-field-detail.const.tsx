import { IHeaderTab } from '@ibs/components';
import { IContentComponent, IContentComponentField } from '@ibs/shared';
import * as yup from 'yup';
import { generatePath } from 'react-router-dom';

import { CONTENT_COMPONENT_PATHS } from '../../content-components.routes';

export const editFieldSchema = yup.object({
	name: yup.string().required(),
	config: yup.object(),
	min: yup.number().required(),
	max: yup.number().required(),
	multiLanguage: yup.boolean().required(),
});

export const FIELD_DETAIL_TABS = (
	siteId: string,
	contentComponent?: IContentComponent,
	field?: IContentComponentField
): IHeaderTab[] => [
	{
		to: generatePath(CONTENT_COMPONENT_PATHS.FIELD_DETAIL_SETTINGS, {
			contentComponentId: contentComponent?.id || '',
			fieldId: field?.id || '',
			siteId,
		}),
		label: 'Settings',
	},
	{
		to: generatePath(CONTENT_COMPONENT_PATHS.FIELD_DETAIL_CONFIGURATION, {
			contentComponentId: contentComponent?.id || '',
			fieldId: field?.id || '',
			siteId,
		}),
		label: 'Configuration',
	},
	{
		to: generatePath(CONTENT_COMPONENT_PATHS.FIELD_DETAIL_VALIDATION, {
			contentComponentId: contentComponent?.id || '',
			fieldId: field?.id || '',
			siteId,
		}),
		label: 'Validation',
		disabled: true,
	},
	{
		to: generatePath(CONTENT_COMPONENT_PATHS.FIELD_DETAIL_DEFAULT_VALUE, {
			contentComponentId: contentComponent?.id || '',
			fieldId: field?.id || '',
			siteId,
		}),
		label: 'Default Value',
		disabled: true,
	},
];
