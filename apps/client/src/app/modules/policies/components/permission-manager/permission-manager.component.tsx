import { FC } from 'react';
import { useFieldArray } from 'react-hook-form';
import cx from 'classnames/bind';
import { Button, ButtonSizes, ButtonTypes } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { SelectField, TextField } from '@ibs/forms';

import { IPermissionManagerProps } from './permission-manager.types';
import styles from './permission-manager.module.scss';
import { PERMISSION_EFFECT_OPTIONS } from './permission-manager.const';
const cxBind = cx.bind(styles);

export const PermissionManager: FC<IPermissionManagerProps> = ({ name, iamActions }: IPermissionManagerProps) => {
	const { t } = useTranslation();
	const { fields, append, remove } = useFieldArray({
		name,
	});

	return (
		<div className={cxBind('o-permission-manager')}>
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
									<SelectField name={`permissions.${index}.actions.0`} fieldConfiguration={{ options: iamActions.map((action) => ({ value: action.key, label: action.key })) }} label='Action' />
								</div>
							</div>
						</div>
						<div className={cxBind('o-permission-manager__permission__actions')}>
							<Button size={ButtonSizes.NORMAL} type={ButtonTypes.SECONDARY} onClick={() => remove(index)}>
								<i className="las la-trash"></i>
							</Button>
						</div>
					</div>
				))}
			</div>
			<button type='button' className={cxBind('o-permission-manager__add')} onClick={() => append(null)}>
				<i className="las la-plus"></i>
				<p>
					{t('PERMISSIONS.ADD')}
				</p>
			</button>
		</div>
	);
};
