import { FC } from 'react';
import cx from 'classnames/bind';
import {useFormContext} from "react-hook-form";
import { useTranslation } from 'react-i18next';

import { IFieldValueProps } from './field-value.types';
import styles from './field-value.module.scss';
const cxBind = cx.bind(styles);

export const FieldValue: FC<IFieldValueProps> = ({ name }: IFieldValueProps) => {
	const { watch } = useFormContext();
	const { t } = useTranslation();

	const value = watch(name);

	return (
		<div className={cxBind('a-input__value')}>{value ?? <span className='u-text--light'>{t('GENERAL.LABELS.NO_DATA')}</span>}</div>
	);
};
