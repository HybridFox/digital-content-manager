import { TFunction } from 'i18next';

import { Badge, Button, ButtonLink, ButtonSizes, ButtonTypes, HasPermission, ITableColumn } from '~components';

import { ILanguage, ISite } from '~shared';

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
					<ButtonLink to={`${item.id}/content`} size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY}>
						<i className="las la-eye"></i> {t(`GENERAL.LABELS.VIEW`)}
					</ButtonLink>
				)}
				<HasPermission resource={`urn:dcm:sites::${item.id}`} action='root::sites:update'>
					<ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} className="u-margin-left-sm">
						<i className="las la-pen"></i> {t(`GENERAL.LABELS.EDIT`)}
					</ButtonLink>
				</HasPermission>
				<HasPermission resource={`urn:dcm:sites::${item.id}`} action='root::sites:remove'>
					<Button size={ButtonSizes.SMALL} className="u-margin-left-sm" onClick={() => handleRemove(item.id as string)}>
						<i className="las la-trash"></i>
					</Button>
				</HasPermission>
			</div>
		),
	},
];
