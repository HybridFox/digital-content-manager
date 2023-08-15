import * as yup from 'yup';
import dayjs from 'dayjs';
import { ResourceKind } from '@ibs/shared';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { ITableColumn, TableCheckbox, TableIcon, TableImagePreview } from '../table';
import { Button, ButtonSizes, ButtonTypes } from '../button';

import { ResourceExplorerAction } from './resource-explorer.types';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const addContentComponentSchema = yup.object({
	contentComponentId: yup.string().required(),
	name: yup.string().required(),
});

export const RESOURCE_COLUMNS = (
	siteId: string | null,
	path: string[],
	actions: ResourceExplorerAction[],
	onNavigate: (path: string) => void,
	handleRemoveDirectory: (name: string) => void,
	handleRemoveFile: (name: string) => void,
): ITableColumn[] => [
	{
		id: 'kind',
		label: '',
		width: '50px',
		format: (value, key, item) => {
			if ((item.mimeType as null | string)?.startsWith('image')) {
				return <TableImagePreview url={`/admin-api/v1/sites/${siteId}/storage-repositories/${item.storageRepositoryId}/files?path=${path.join('/')}/${item.name}`} />;
			}

			if (value === ResourceKind.DIRECTORY) {
				return <TableIcon icon="las la-folder" />;
			}

			if (value === ResourceKind.FILE) {
				return <TableIcon icon="las la-file" />;
			}

			return <TableIcon icon="las la-question" />;
		},
	},
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'updatedAt',
		label: 'Updated At',
		format: (value) => {
			if (value) {
				return dayjs.utc(value as string).fromNow();
			}

			return null;
		},
	},
	{
		id: 'createdAt',
		label: 'Created At',
		format: (value) => {
			if (value) {
				return dayjs.utc(value as string).fromNow();
			}

			return null;
		},
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => {
			if (item.kind === ResourceKind.DIRECTORY) {
				return (
					<div className="u-display-flex">
						{actions.includes(ResourceExplorerAction.VIEW) && (<Button
							onClick={() => onNavigate(item.name as string)}
							size={ButtonSizes.SMALL}
							className="u-margin-left-auto"
						>
							<i className="las la-eye"></i> View
						</Button>)}
						{actions.includes(ResourceExplorerAction.REMOVE) && (<Button
							onClick={() => handleRemoveDirectory(item.name as string)}
							size={ButtonSizes.SMALL}
							className="u-margin-left-sm"
						>
							<i className="las la-trash"></i>
						</Button>)}
					</div>
				);
			}

			if (item.kind === ResourceKind.FILE) {
				if (actions.includes(ResourceExplorerAction.REMOVE)) {
					return (
						<div className="u-display-flex">
							<Button
								onClick={() => handleRemoveFile(item.name as string)}
								size={ButtonSizes.SMALL}
								className="u-margin-left-auto"
							>
								<i className="las la-trash"></i>
							</Button>
						</div>
					);
				}
			}

			return null;
		},
	},
];
