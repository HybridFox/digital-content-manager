import { TFunction } from 'i18next';

import { Badge, Button, ButtonLink, ButtonSizes, ITableColumn } from '~components';

import { IWebhook } from '~shared';

export const WEBHOOKS_LIST_COLUMNS = (t: TFunction, handleDelete: (webhookId: string) => void, deleteLoading: boolean): ITableColumn<IWebhook>[] => [
	{
		id: 'url',
		label: 'URL',
	},
	{
		id: 'event',
		label: 'Event',
		format(value, key, item, index) {
			return <Badge>{t(`WEBHOOKS.EVENTS.${(value as string)?.toUpperCase()}`)}</Badge>
		},
	},
	{
		id: 'active',
		label: 'Active',
		format(value) {
			if (value) {
				return <span className='las la-check u-text--success'></span>
			}

			return <span className='las la-times u-text--danger'></span>;
		},
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex">
				<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} className="u-margin-left-auto">
					<i className="las la-pen"></i> {t(`GENERAL.LABELS.EDIT`)}
				</ButtonLink>
				<Button size={ButtonSizes.SMALL} className="u-margin-left-sm" onClick={() => handleDelete(item.id)} confirmable confirmLoading={deleteLoading}>
					<i className="las la-trash"></i>
				</Button>
			</div>
		),
	},
];
