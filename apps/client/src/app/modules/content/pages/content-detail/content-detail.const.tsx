import * as yup from 'yup';
import { generatePath } from 'react-router-dom';


import { Badge, IHeaderTab } from '~components';

import { CONTENT_PATHS } from '../../content.routes';

import { IContentItem, IContentType } from '~shared';

export const editContentType = yup.object({
	name: yup.string().required(),
	description: yup.string(),
});

export const CONTENT_DETAIL_TABS = (
	siteId: string,
	kind?: string,
	contentItem?: IContentItem,
	contentType?: IContentType,
): IHeaderTab[] => [
	{
		to: generatePath(CONTENT_PATHS.DETAIL_SETTINGS, {
			contentId: contentItem?.id || '',
			kind,
			siteId,
		}),
		label: 'Settings',
	},
	...(contentType?.compartments?.length ? (contentType?.compartments || []).map((compartment) => ({
		to: generatePath(CONTENT_PATHS.DETAIL_COMPARTMENT, {
			contentId: contentItem?.id || '',
			kind,
			siteId,
			compartmentId: compartment.id
		}),
		label: compartment.name,
	})) : [{
		to: generatePath(CONTENT_PATHS.DETAIL_FIELDS, {
			contentId: contentItem?.id || '',
			kind,
			siteId,
		}),
		label: 'Fields',
	}]),
	{
		to: generatePath(CONTENT_PATHS.DETAIL_REVISIONS, {
			contentId: contentItem?.id || '',
			kind,
			siteId,
		}),
		label: 'Revisions',
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
