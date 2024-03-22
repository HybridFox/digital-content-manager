import * as yup from 'yup';
import { generatePath } from 'react-router-dom';

import { IHeaderTab } from '~components';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

import { FIELD_KEYS, IContentType, IContentTypeField } from '~shared';

export const editFieldSchema = yup.object({
	name: yup.string().required(),
	slug: yup.string().required(),
	min: yup.number().required(),
	max: yup.number().required(),
	multiLanguage: yup.boolean().required(),
	config: yup.object(),
});

export const FIELD_DETAIL_TABS = (
	siteId: string,
	contentType?: IContentType,
	field?: IContentTypeField
): IHeaderTab[] => [
	{
		to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL_SETTINGS, {
			contentTypeId: contentType?.id || '',
			fieldId: field?.id || '',
			siteId,
		}),
		label: 'Settings',
	},
	...(field?.contentComponent.componentName === FIELD_KEYS.BLOCK ? [
		{
			to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL_BLOCKS, {
				contentTypeId: contentType?.id || '',
				fieldId: field?.id || '',
				siteId,
			}),
			label: 'Blocks',
		}] : [{
			to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL_CONFIGURATION, {
				contentTypeId: contentType?.id || '',
				fieldId: field?.id || '',
				siteId,
			}),
			label: 'Configuration',
		}]),
	{
		to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL_VALIDATION, {
			contentTypeId: contentType?.id || '',
			fieldId: field?.id || '',
			siteId,
		}),
		label: 'Validation',
		disabled: true,
	},
	{
		to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL_DEFAULT_VALUE, {
			contentTypeId: contentType?.id || '',
			fieldId: field?.id || '',
			siteId,
		}),
		label: 'Default Value',
		disabled: true,
	},
];
