import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip'

import { INumberFieldProps } from './number-field.types';
import styles from './number-field.module.scss';

const cxBind = cx.bind(styles);

export const NumberField: FC<INumberFieldProps> = ({
	name,
	label,
	placeholder,
	fieldOptions,
}: INumberFieldProps) => {
	const { register, formState: { errors } } = useFormContext();
	const error = errors?.[name];

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
					type="number"
					className={cxBind('a-input__field')}
					id={name}
					placeholder={placeholder}
					{...register(name, {
						...fieldOptions,
					})}
				/>
				{error && (
					<>
						<Tooltip anchorSelect={`#${name}-err-tooltip`}>
							{error.message?.toString()}
						</Tooltip>
						<div className={cxBind('a-input__error')} id={`${name}-err-tooltip`}>
							<i className="las la-exclamation-triangle"></i>
						</div>
					</>
					
				)}
			</div>
		</div>
	);
};
