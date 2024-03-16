import { TFunction } from 'i18next';
import { generatePath } from 'react-router-dom';
import * as yup from 'yup';
import dayjs from 'dayjs';

import { Badge, ButtonLink, ButtonSizes, ButtonTypes, ITableColumn } from '~components';

import { CONTENT_PATHS } from '../../content.routes';

import { DATE_FORMAT, IContentRevision } from '~shared';

export const addContentComponentSchema = yup.object({
	contentComponentId: yup.string().required(),
	name: yup.string().required(),
});

export const CONTENT_TRANSLATIONS_LIST_COLUMNS = (siteId: string, kind: string, contentId: string, revisions: IContentRevision[], t: TFunction): ITableColumn<IContentRevision>[] => [
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
		format: (value, key, item, index) => {
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

			if (!revisions[index + 1]?.id) {
				return <></>
			};
			
			return (
				<div className="u-display-flex">
					<ButtonLink
						to={generatePath(CONTENT_PATHS.DETAIL_REVISION_CHANGES, {
							siteId,
							contentId,
							firstRevisionId: item.id,
							secondRevisionId: revisions[index + 1]?.id,
							kind
						})}
						size={ButtonSizes.SMALL}
						className="u-margin-left-auto"
					>
						<i className="las la-eye"></i> View changes
					</ButtonLink>
				</div>
			);
		},
	},
];
