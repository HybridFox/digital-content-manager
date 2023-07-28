import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { ISelectFieldProps, ISelectOptions } from './select-field.types';
import styles from './select-field.module.scss';

const cxBind = cx.bind(styles);

export const SelectField: FC<ISelectFieldProps> = ({
	name,
	label,
	placeholder,
	fieldConfiguration,
	fieldOptions,
}: ISelectFieldProps) => {
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
				<select
					className={cxBind('a-input__field')}
					placeholder={placeholder}
					{...register(name, {
						...fieldOptions,
					})}
				>
					{(fieldConfiguration?.options as ISelectOptions[] || []).map((option, i) => (
						<option key={i} value={option.value}>{option.label}</option>
					))}
				</select>
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
				<div className={cxBind('a-input__select-icon')}>
					<i className="las la-angle-down"></i>
				</div>
			</div>
		</div>
	);
};
