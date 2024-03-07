import { FC } from 'react';
import { useFieldArray } from 'react-hook-form';
import cx from 'classnames/bind';
import { Button, ButtonSizes } from '~components';
import { useTranslation } from 'react-i18next';
import { SelectField, TextField } from '~forms';
import classNames from 'classnames';

import { IPermissionManagerProps } from './permission-manager.types';
import styles from './permission-manager.module.scss';
import { PERMISSION_EFFECT_OPTIONS } from './permission-manager.const';
const cxBind = cx.bind(styles);

export const PermissionManager: FC<IPermissionManagerProps> = ({ name, iamActions }: IPermissionManagerProps) => {
	const { t } = useTranslation();
	const { fields, append, remove } = useFieldArray({
		name,
	});

	const handleCopy = (index: number): void => {
		const indexValues = fields[index];
		append(indexValues);
	}

	const fieldOptions = iamActions.reduce((acc, action) => {
		const [_, actionKey] = action.key.split('::');
		const [group] = actionKey.split(':');

		const existingFieldGroup = acc.find(({ label }) => group === label);
		return [
			...acc.filter(({ label }) => label !== group),
			{
				label: group,
				options: [...existingFieldGroup?.options || [], {
					label: action.key,
					value: action.key,
				}]
			}
		]
	}, [] as any[]);

	return (
		<div className={classNames(cxBind('o-permission-manager'), 'o-permission-manager')}>
			<div className={cxBind('o-permission-manager__permissions')}>
				{fields.map((_, index) => (
					<div className={cxBind('o-permission-manager__permission')} key={index}>
						<div className={cxBind('o-permission-manager__permission__content')}>
							<div className="u-row">
								<div className="u-col-md-4">
									<SelectField name={`permissions.${index}.effect`} fieldConfiguration={{ options: PERMISSION_EFFECT_OPTIONS }} label='Effect' />
								</div>
								<div className="u-col-md-4">
									<TextField name={`permissions.${index}.resources.0`} label='Resource' />
								</div>
								<div className="u-col-md-4">
									<SelectField name={`permissions.${index}.actions.0`} fieldConfiguration={{ options: fieldOptions }} label='Action' />
								</div>
							</div>
						</div>
						<div className={cxBind('o-permission-manager__permission__actions')}>
							<Button size={ButtonSizes.NORMAL} onClick={() => handleCopy(index)}>
								<i className="las la-copy"></i>
							</Button>
							<Button size={ButtonSizes.NORMAL} className='u-margin-left-xs' onClick={() => remove(index)}>
								<i className="las la-trash"></i>
							</Button>
						</div>
					</div>
				))}
			</div>
			<button type='button' className={cxBind('o-permission-manager__add')} onClick={() => append({ effect: 'grant', resources: ['urn:dcm:*'] })}>
				<i className="las la-plus"></i>
				<p>
					{t('PERMISSIONS.ADD')}
				</p>
			</button>
		</div>
	);
};
