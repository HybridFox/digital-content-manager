import { FC } from 'react';
import cx from 'classnames/bind';

import { IFieldLabelProps } from './field-label.types';
import styles from './field-label.module.scss';
const cxBind = cx.bind(styles);

export const FieldLabel: FC<IFieldLabelProps> = ({ label, multiLanguage, name }: IFieldLabelProps) => {
	if (!label) {
		return null;
	}

	const renderIcon = () => {
		if (multiLanguage === undefined) {
			return null;
		}

		if (multiLanguage) {
			return <span className="las la-globe" />
		}

		return <span className="las la-exchange-alt" />
	}

	return (
		<label htmlFor={name} className={cxBind('a-input__label')}>
			<span>{label}</span>
			{multiLanguage !== undefined && renderIcon()}
		</label>
	);
};
