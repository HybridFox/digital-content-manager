import * as yup from 'yup';
import { generatePath } from 'react-router-dom';

import { IHeaderTab } from '~components';

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
];

export const CONTENT_DETAIL_META_TABS = (
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
		label: <span className="las la-cog"></span>,
	},
	{
		to: generatePath(CONTENT_PATHS.DETAIL_REVISIONS, {
			contentId: contentItem?.id || '',
			kind,
			siteId,
		}),
		label: <span className="las la-history"></span>,
	},
	{
		to: generatePath(CONTENT_PATHS.DETAIL_TRANSLATIONS, {
			contentId: contentItem?.id || '',
			kind,
			siteId,
		}),
		label: <span className="las la-language"></span>,
	},
	{
		to: generatePath(CONTENT_PATHS.DETAIL_EDITOR, {
			contentId: contentItem?.id || '',
			kind,
			siteId,
		}),
		label: <span className="las la-bug"></span>,
	},
];
