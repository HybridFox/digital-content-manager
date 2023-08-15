import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { Select } from '../../components/select';
import { IRenderControllerField } from '../fields.types';

import { ISelectFieldProps, ISelectOptions } from './select-field.types';
import styles from './select-field.module.scss';

const cxBind = cx.bind(styles);

export const SelectField: FC<ISelectFieldProps> = ({ name, label, placeholder, fieldConfiguration, field }: ISelectFieldProps) => {
	const { control } = useFormContext();

	const getMappedValue = (value: string | string[]): ISelectOptions | ISelectOptions[] | undefined => {
		if (Array.isArray(value)) {
			return ((fieldConfiguration?.options as ISelectOptions[]) || []).filter(({ value: optionValue }) => value.includes(optionValue));
		}

		return ((fieldConfiguration?.options as ISelectOptions[]) || []).find(({ value: optionValue }) => optionValue === value);
	}

	const renderField = ({ field: { onChange, value }, formState: { errors } }: IRenderControllerField) => {
		const mappedValue = getMappedValue(value);

		return (
			<div
				className={cxBind('a-input', {
					'a-input--has-error': !!errors?.[name],
				})}
			>
				{label && (
					<label htmlFor={name} className={cxBind('a-input__label')}>
						{label}
					</label>
				)}
				<div className={cxBind('a-input__field-wrapper')}>
					<Select
						min={field?.min ?? 1}
						max={field?.max ?? 1} 
						hasError={!!errors?.[name]}
						onChange={onChange}
						value={mappedValue}
						options={(fieldConfiguration?.options as ISelectOptions[]) || []}
					/>
					{errors?.[name] && (
						<>
							<Tooltip anchorSelect={`#${name}-err-tooltip`}>{errors?.[name]?.message?.toString()}</Tooltip>
							<div className={cxBind('a-input__error')} id={`${name}-err-tooltip`}>
								<i className="las la-exclamation-triangle"></i>
							</div>
						</>
					)}
				</div>
			</div>
		);
	};

	return <Controller control={control} name={name} render={renderField} />;
};
