import { Badge, IHeaderTab } from '@ibs/components';
import * as yup from 'yup';
import { generatePath } from 'react-router-dom';
import { IContentItem } from '@ibs/shared';

import { CONTENT_PATHS } from '../../content.routes';

export const editContentType = yup.object({
	name: yup.string().required(),
	description: yup.string(),
});

export const CONTENT_DETAIL_TABS = (
	siteId: string,
	kind?: string,
	contentItem?: IContentItem,
): IHeaderTab[] => [
	{
		to: generatePath(CONTENT_PATHS.DETAIL_SETTINGS, {
			contentId: contentItem?.id || '',
			kind,
			siteId,
		}),
		label: 'Settings',
	},
	{
		to: generatePath(CONTENT_PATHS.DETAIL_FIELDS, {
			contentId: contentItem?.id || '',
			kind,
			siteId,
		}),
		label: 'Fields',
	},
	// {
	// 	to: generatePath(CONTENT_PATHS.DETAIL_STATUS, {
	// 		contentId: contentItem?.id || '',
	// 		kind,
	// 		siteId,
	// 	}),
	// 	label: <>Status <Badge>{contentItem?.currentWorkflowState?.name}</Badge></>,
	// },
	{
		to: generatePath(CONTENT_PATHS.DETAIL_TRANSLATIONS, {
			contentId: contentItem?.id || '',
			kind,
			siteId,
		}),
		label: 'Translations',
	},
];
