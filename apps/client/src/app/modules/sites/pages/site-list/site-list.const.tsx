import { Badge, Button, ButtonLink, ButtonSizes, ButtonTypes, HasPermission, ITableColumn } from '@ibs/components';
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
		format: (languages: ILanguage[]) => languages.map((language) => <Badge className='u-margin-right-xs u-margin-top-xxxs u-margin-bottom-xxxs' key={language.id}>{language.name}</Badge>)
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => (
			<div className="u-display-flex u-justify-content-end">
				{item?.hasPermission && (
					<ButtonLink to={`${item.id}/dashboard`} size={ButtonSizes.SMALL} type={ButtonTypes.PRIMARY}>
						<i className="las la-eye"></i> {t(`GENERAL.LABELS.VISIT`)}
					</ButtonLink>
				)}
				<HasPermission resource={`urn:ibs:sites::${item.id}`} action='sites:update'>
					<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className="u-margin-left-sm">
						<i className="las la-pen"></i> {t(`GENERAL.LABELS.EDIT`)}
					</ButtonLink>
				</HasPermission>
				<HasPermission resource={`urn:ibs:sites::${item.id}`} action='sites:remove'>
					<Button size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className="u-margin-left-sm" onClick={() => handleRemove(item.id as string)}>
						<i className="las la-trash"></i>
					</Button>
				</HasPermission>
			</div>
		),
	},
];
