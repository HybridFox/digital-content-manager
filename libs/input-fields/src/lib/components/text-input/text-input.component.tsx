import { FC } from 'react';
import { useForm } from 'react-hook-form';
import cx from 'classnames/bind';

import { TextInputProps } from './text-input.types';
import styles from './text-input.module.scss';

const cxBind = cx.bind(styles);

export const TextInput: FC<TextInputProps> = ({
	name,
	type,
	label,
	placeholder,
}: TextInputProps) => {
	const { register } = useForm();

	return (
		<div className={cxBind('a-input')}>
			{label && (
				<label htmlFor={name} className={cxBind('a-input__label')}>
					{label}
				</label>
			)}
			<input
				type={type}
				className={cxBind('a-input__field')}
				placeholder={placeholder}
				{...register(name)}
			/>
		</div>
	);
};
