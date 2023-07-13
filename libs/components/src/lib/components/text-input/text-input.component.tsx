import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';

import { ITextInputProps } from './text-input.types';
import styles from './text-input.module.scss';
import { TextInputTypes } from './text-input.const';

const cxBind = cx.bind(styles);

export const TextInput: FC<ITextInputProps> = ({
	name,
	type = TextInputTypes.TEXT,
	label,
	placeholder,
	options,
}: ITextInputProps) => {
	const { register, formState: { errors } } = useFormContext();
	const error = errors?.[name]

	return (
		<div className={cxBind('a-input', {
			'a-input--has-error': !!error
		})}>
			{label && (
				<label htmlFor={name} className={cxBind('a-input__label')}>
					{label}
				</label>
			)}
			<div className={cxBind('a-input__field-wrapper')}>
				<input
					type={type}
					className={cxBind('a-input__field')}
					placeholder={placeholder}
					{...register(name, {
						...options,
					})}
				/>
				{error && (
					<div className={cxBind('a-input__error')}>
						<i className="las la-exclamation-triangle"></i>
					</div>
				)}
			</div>
		</div>
	);
};
