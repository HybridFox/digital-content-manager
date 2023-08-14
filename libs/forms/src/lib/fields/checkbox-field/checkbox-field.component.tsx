import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { IRenderControllerField } from '../fields.types';

import { ICheckboxFieldProps, ICheckboxOption } from './checkbox-field.types';
import styles from './checkbox-field.module.scss';

const cxBind = cx.bind(styles);

export const CheckboxField: FC<ICheckboxFieldProps> = ({ name, label, placeholder, fieldConfiguration, fieldOptions }: ICheckboxFieldProps) => {
	const {
		control
	} = useFormContext();


	const renderField = ({
		field: { onChange, value },
		formState: { errors },
	}: IRenderControllerField) => {
		const error = errors?.[name];

		const handleChange = (changeValue: string) => {
			if ((value || []).includes(changeValue)) {
				return onChange(value.filter((v: string) => v !== changeValue));
			}

			onChange([...value || [], changeValue]);
		}
		
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
					{((fieldConfiguration?.options as ICheckboxOption[]) || []).map((option, i) => (
						<div className={cxBind('a-input__field')} key={option.value}>
							<input
								type="checkbox"
								id={option.value}
								checked={(value || []).includes(option.value)}
								onChange={(e) => handleChange(option.value)}
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

	return (
		<Controller control={control} name={name} render={renderField} />
	);
};
