import { FC } from 'react';
import cx from 'classnames/bind';

import { IFieldHintProps } from './field-label.types';
import styles from './field-hint.module.scss';
const cxBind = cx.bind(styles);

export const FieldHint: FC<IFieldHintProps> = ({ hint }: IFieldHintProps) => {
	if (!hint) {
		return null;
	}

	return (
		<p className={cxBind('a-input__hint')}>
			{hint}
		</p>
	);
};
