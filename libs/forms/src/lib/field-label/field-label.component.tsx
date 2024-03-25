import { FC } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';

import { FieldViewMode } from '../fields';
import { FieldError } from '../field-error/field-error.component';

import { IFieldLabelProps } from './field-label.types';
import styles from './field-label.module.scss';
const cxBind = cx.bind(styles);

export const FieldLabel: FC<IFieldLabelProps> = ({ label, multiLanguage, name, viewMode = FieldViewMode.EDIT }: IFieldLabelProps) => {
	if (!label) {
		return null;
	}

	const renderIcon = () => {
		if (multiLanguage === undefined) {
			return null;
		}

		if (multiLanguage) {
			return <span className={classNames('las la-globe', cxBind('a-input__icon'))} />
		}

		return <span className={classNames('las la-exchange-alt', cxBind('a-input__icon'))} />
	}

	return (
		<label htmlFor={name} className={cxBind('a-input__label')}>
			<span>{label}</span> <FieldError name={name!} />
			{viewMode === FieldViewMode.EDIT && multiLanguage !== undefined && renderIcon()}
		</label>
	);
};
