import * as yup from 'yup';
import { generatePath } from 'react-router-dom';

import { IHeaderTab } from '~components';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

import { FIELD_KEYS, IContentType, IContentTypeField } from '~shared';

export const editFieldSchema = yup.object({
	name: yup.string().required(),
	min: yup.number().required(),
	max: yup.number().required(),
	multiLanguage: yup.boolean().required(),
	config: yup.object(),
});

export const FIELD_DETAIL_TABS = (
	siteId: string,
	contentType?: IContentType,
	field?: IContentTypeField,
	block?: IContentTypeField
): IHeaderTab[] => [
	{
		to: generatePath(CONTENT_TYPES_PATHS.BLOCK_DETAIL_SETTINGS, {
			contentTypeId: contentType?.id || '',
			fieldId: field?.id || '',
			blockId: block?.id || '',
			siteId,
		}),
		label: 'Settings',
	},
	{
		to: generatePath(CONTENT_TYPES_PATHS.BLOCK_DETAIL_CONFIGURATION, {
			contentTypeId: contentType?.id || '',
			fieldId: field?.id || '',
			blockId: block?.id || '',
			siteId,
		}),
		label: 'Configuration',
	}
];
