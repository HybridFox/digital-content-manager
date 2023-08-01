import { IHeaderTab } from '@ibs/components';
import { IContentType, IContentTypeField } from '@ibs/shared';
import * as yup from 'yup';
import { generatePath } from 'react-router-dom';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

export const editFieldSchema = yup.object({
	name: yup.string().required(),
	min: yup.number().required(),
	max: yup.number().required(),
	multiLanguage: yup.boolean().required(),
	config: yup.object(),
});

export const FIELD_DETAIL_TABS = (
	contentType?: IContentType,
	field?: IContentTypeField
): IHeaderTab[] => [
	{
		to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL_SETTINGS, {
			contentTypeId: contentType?.id || '',
			fieldId: field?.id || '',
		}),
		label: 'Settings',
	},
	{
		to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL_CONFIGURATION, {
			contentTypeId: contentType?.id || '',
			fieldId: field?.id || '',
		}),
		label: 'Configuration',
	},
	{
		to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL_VALIDATION, {
			contentTypeId: contentType?.id || '',
			fieldId: field?.id || '',
		}),
		label: 'Validation',
		disabled: true,
	},
	{
		to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL_DEFAULT_VALUE, {
			contentTypeId: contentType?.id || '',
			fieldId: field?.id || '',
		}),
		label: 'Default Value',
		disabled: true,
	},
];
