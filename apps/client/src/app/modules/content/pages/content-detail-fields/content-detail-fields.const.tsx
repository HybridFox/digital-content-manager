import { IHeaderTab } from '@ibs/components';
import * as yup from 'yup';
import { generatePath } from 'react-router-dom';

import { CONTENT_PATHS } from '../../content.routes';
import { IContentItem } from '../../stores/content';

export const editContentType = yup.object({
	name: yup.string().required(),
	description: yup.string(),
});

export const CONTENT_DETAIL_TABS = (
	kind?: string,
	contentItem?: IContentItem,
): IHeaderTab[] => [
	{
		to: generatePath(CONTENT_PATHS.DETAIL_SETTINGS, {
			contentId: contentItem?.id || '',
			kind,
		}),
		label: 'Settings',
		disabled: true,
	},
	{
		to: generatePath(CONTENT_PATHS.DETAIL_FIELDS, {
			contentId: contentItem?.id || '',
			kind,
		}),
		label: 'Fields',
	},
	{
		to: generatePath(CONTENT_PATHS.DETAIL_TRANSLATIONS, {
			contentId: contentItem?.id || '',
			kind,
		}),
		label: 'Translations',
	},
];
