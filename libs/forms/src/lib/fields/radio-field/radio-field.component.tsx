import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { IRadioFieldProps, IRadioOption } from './radio-field.types';
import styles from './radio-field.module.scss';

const cxBind = cx.bind(styles);

export const RadioField: FC<IRadioFieldProps> = ({ name, label, placeholder, fieldConfiguration, fieldOptions }: IRadioFieldProps) => {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	const error = errors?.[name];

	return (
		<div
			className={cxBind('a-input', {
				'a-input--has-error': !!error,
			})}
		>
			{label && (
				<label className={cxBind('a-input__label')}>
					{label}
				</label>
			)}
			<div className={cxBind('a-input__field-wrapper')}>
				{((fieldConfiguration?.options as IRadioOption[]) || []).map((option, i) => (
					<div className={cxBind('a-input__field')} key={option.value}>
						<input
							type="radio"
							id={option.value}
							value={option.value}
							{...register(name, {
								...fieldOptions,
							})}
							className={cxBind('a-input__radio')}
						/>
						<label htmlFor={option.value}>{option.label}</label>
					</div>
				))}
				{error && (
					<>
						<Tooltip anchorSelect={`#${name}-err-tooltip`}>{error.message?.toString()}</Tooltip>
						<div className={cxBind('a-input__error')} id={`${name}-err-tooltip`}>
							<i className="las la-exclamation-triangle"></i>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
