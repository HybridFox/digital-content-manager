import { Badge, Button, ButtonLink, ButtonSizes, ButtonTypes, ITableColumn } from '@ibs/components';
import { TFunction } from 'i18next';

export const STORAGE_REPOSITORIES_LIST_COLUMNS = (t: TFunction): ITableColumn[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'kind',
		label: 'Kind',
		format(value, key, item, index) {
			return <Badge>{t(`STORAGE_REPOSITORIES.KINDS.${(value as string).toUpperCase()}`)}</Badge>
		},
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex">
				<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className="u-margin-left-auto">
					<i className="las la-pen"></i> {t(`GENERAL.LABELS.EDIT`)}
				</ButtonLink>
				<Button size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className="u-margin-left-sm">
					<i className="las la-trash"></i>
				</Button>
			</div>
		),
	},
];
