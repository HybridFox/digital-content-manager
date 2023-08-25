import { Badge, ButtonLink, ButtonSizes, ButtonTypes, ITableColumn } from '@ibs/components';
import { TFunction } from 'i18next';
import { generatePath } from 'react-router-dom';
import * as yup from 'yup';
import { DATE_FORMAT, IContentRevision } from '@ibs/shared';
import dayjs from 'dayjs';

import { CONTENT_PATHS } from '../../content.routes';

export const addContentComponentSchema = yup.object({
	contentComponentId: yup.string().required(),
	name: yup.string().required(),
});

export const CONTENT_TRANSLATIONS_LIST_COLUMNS = (siteId: string, kind: string, contentId: string, revisionSelection: string[], t: TFunction): ITableColumn<IContentRevision>[] => [
	// {
	// 	id: 'language.key',
	// 	label: 'Language',
	// 	// width: '150px',
	// 	format: (value) => (value as string).toUpperCase(),
	// },
	// {
	// 	id: 'name',
	// 	label: 'Name',
	// 	format: (value) => (value as string) || <span className="u-text--light u-text--italic">No content item</span>,
	// },
	{
		id: 'createdAt',
		label: 'Created at',
		format: (value) => dayjs.utc(value as string).format(DATE_FORMAT)
	},
	{
		id: 'workflowState.name',
		label: 'Workflow state',
		format: (value) => <Badge>{value}</Badge>
	},
	{
		id: 'user.name',
		label: 'User'
	},
	{
		id: 'published',
		label: 'Published',
		format(value, key, item, index) {
			if (value) {
				return <span className='las la-check u-text--success'></span>
			}

			return <span className='las la-times u-text--danger'></span>;
		},
	},
	{
		id: 'actions',
		label: '',
		// width: '150px',
		format: (value, key, item) => {
			// if (item.id) {
			// 	return (
			// 		<div className="u-display-flex">
			// 			<ButtonLink
			// 				to={generatePath(CONTENT_PATHS.DETAIL, { siteId, contentId: item.id, kind })}
			// 				size={ButtonSizes.SMALL}
			// 				className="u-margin-left-auto"
			// 			>
			// 				<i className="las la-pen"></i> Edit
			// 			</ButtonLink>
			// 		</div>
			// 	);
			// }

			return (
				<div className="u-display-flex">
					<ButtonLink
						to={generatePath(CONTENT_PATHS.DETAIL_REVISION_PREVIEW, {
							siteId,
							contentId,
							revisionId: item.id,
							kind
						})}
						size={ButtonSizes.SMALL}
						className="u-margin-left-auto"
					>
						<i className="las la-eye"></i> View
					</ButtonLink>
				</div>
			);
		},
	},
];
