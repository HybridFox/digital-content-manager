import { Badge, Button, ButtonLink, ButtonSizes, ITableColumn } from '@ibs/components';
import { CONTENT_TYPE_KINDS_TRANSLATIONS, ContentTypeKinds } from '@ibs/shared';
import { TFunction } from 'i18next';
import * as yup from 'yup';

export const addContentComponentSchema = yup.object({
	contentComponentId: yup.string().required(),
	name: yup.string().required(),
});

export const CONTENT_TYPE_LIST_COLUMNS = (t: TFunction): ITableColumn[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'slug',
		label: 'Slug',
	},
	{
		id: 'kind',
		label: 'Kind',
		format: (value) => <Badge>{CONTENT_TYPE_KINDS_TRANSLATIONS[value as ContentTypeKinds]}</Badge>,
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex">
				<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} className="u-margin-left-auto">
					<i className="las la-pen"></i> {t('GENERAL.LABELS.EDIT')}
				</ButtonLink>
				<Button size={ButtonSizes.SMALL} className="u-margin-left-sm">
					<i className="las la-trash"></i>
				</Button>
			</div>
		),
	},
];
