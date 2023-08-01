import { FC } from 'react';
import cx from 'classnames/bind';
import { IField } from '@ibs/shared';
import { Badge, BadgeSizes } from '@ibs/components';

import { RenderFields } from '../../renderer';

import { IFieldGroupFieldProps } from './field-group-field.types';
import styles from './field-group-field.module.scss';

const cxBind = cx.bind(styles);

export const FieldGroupField: FC<IFieldGroupFieldProps> = ({
	name,
	label,
	fieldConfiguration,
	fieldOptions,
}: IFieldGroupFieldProps) => {
	const renderIcon = () => {
		if (fieldConfiguration?.multiLanguage) {
			return <span className="las la-globe" />
		}

		return <span className="las la-exchange-alt" />
	}

	return (
		<div className={cxBind('o-field-group')}>
			<h4 className={cxBind('o-field-group__header')}>
				<span className={cxBind('o-field-group__title')}><Badge size={BadgeSizes.SMALL}>Group</Badge> <span className='u-margin-left-xs'>{label}</span></span>
				{renderIcon()}
			</h4>
			<div className="u-row">
				<RenderFields fieldPrefix={`${name}.`} fields={fieldConfiguration?.fields as IField[] || []} />
			</div>
		</div>
	);
};
