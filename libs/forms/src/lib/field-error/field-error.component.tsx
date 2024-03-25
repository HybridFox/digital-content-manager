import { FC } from 'react';
import cx from 'classnames/bind';
import { useFormContext } from 'react-hook-form';
import { path } from 'rambda';

import { IFieldErrorProps } from './field-error.types';
import styles from './field-error.module.scss';
const cxBind = cx.bind(styles);

export const FieldError: FC<IFieldErrorProps> = ({ name }: IFieldErrorProps) => {
	const { register, formState: { errors } } = useFormContext();
	const error = path([...name.split('.')])(errors) as any;

	if (!error?.message) {
		return null;
	}

	return (
		<span className={cxBind('a-input__error')}>{error?.message}</span>
	);
};
