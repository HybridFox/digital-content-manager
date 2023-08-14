import { Badge, Button, ButtonLink, ButtonSizes, ButtonTypes, ITableColumn } from '@ibs/components';
import { ILanguage, ISite } from '@ibs/shared';
import { TFunction } from 'i18next';

export const ROLE_LIST_COLUMNS = (t: TFunction, handleRemove: (workflowStateId: string) => void): ITableColumn<ISite>[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'languages',
		label: 'Languages',
		format: (languages: ILanguage[]) => languages.map((language) => <Badge className='u-margin-right-xs' key={language.id}>{language.name}</Badge>)
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex">
				<ButtonLink to={`${item.id}/dashboard`} size={ButtonSizes.SMALL} type={ButtonTypes.PRIMARY} className="u-margin-left-auto">
					<i className="las la-eye"></i> {t(`GENERAL.LABELS.VISIT`)}
				</ButtonLink>
				<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className="u-margin-left-sm">
					<i className="las la-pen"></i> {t(`GENERAL.LABELS.EDIT`)}
				</ButtonLink>
				<Button size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className="u-margin-left-sm" onClick={() => handleRemove(item.id as string)}>
					<i className="las la-trash"></i>
				</Button>
			</div>
		),
	},
];
