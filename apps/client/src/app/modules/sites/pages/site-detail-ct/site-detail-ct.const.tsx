import classNames from 'classnames';
import { TFunction } from 'i18next';

import { Button, ButtonSizes, ButtonTypes, ITableColumn } from '~components';

import { IContentType } from '~shared';

export const CONTENT_TYPE_LIST_COLUMNS = (
	t: TFunction,
	siteContentTypes: IContentType[],
	handleEnable: (ctId: string) => void,
	enableLoading: boolean,
	handleDisable: (ctId: string) => void,
	disableLoading: boolean
): ITableColumn<IContentType>[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'contentOccurrences',
		label: 'Occurrences',
		format: (value, key, item) => (
			<span className={classNames({ 'u-text--light': !siteContentTypes.find((sct) => sct.id === item.id) })}>{value}</span>
		),
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => {
			if (siteContentTypes.find((sct) => sct.id === item.id)) {
				return (
					<div className="u-display-flex u-justify-content-end">
						<Button
							size={ButtonSizes.SMALL}
							className="u-margin-left-sm"
							type={ButtonTypes.DANGER}
							confirmable
							confirmText={`Are you sure you wish to remove the content type "${item.name}"?`}
							onClick={() => handleDisable(item.id as string)}
							confirmLoading={disableLoading}
							disabled={(item.contentOccurrences || 0) !== 0}
						>
							<i className="las la-minus"></i> Disable
						</Button>
					</div>
				);
			}

			return (
				<div className="u-display-flex u-justify-content-end">
					<Button
						size={ButtonSizes.SMALL}
						type={ButtonTypes.DEFAULT}
						className="u-margin-left-sm"
						onClick={() => handleEnable(item.id as string)}
					>
						<i className="las la-plus"></i> Enable
					</Button>
				</div>
			);
		},
	},
];
