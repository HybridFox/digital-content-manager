import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { FieldLabel } from '../../field-label/field-label.component';
import { FieldHint } from '../../field-hint/field-hint.component';
import { FieldViewMode } from '../fields.types';
import { FieldValue } from '../../field-value/field-value.component';
import { FieldDiff } from '../../field-diff/field-diff.component';

import styles from './radio-field.module.scss';
import { IRadioFieldProps, IRadioOption } from './radio-field.types';

const cxBind = cx.bind(styles);

export const RadioField: FC<IRadioFieldProps> = ({ name, label, viewMode = FieldViewMode.EDIT, fieldConfiguration, fieldOptions }: IRadioFieldProps) => {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	const error = errors?.[name];

	const renderField = () => (
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
	);

	const renderValue = () => (
		<FieldValue name={name} />
	)

	const renderDiff = () => (
		<FieldDiff name={name} />
	)

	return (
		<div
			className={cxBind('a-input', {
				'a-input--has-error': !!error,
			})}
		>
			<FieldLabel label={label} multiLanguage={fieldConfiguration?.multiLanguage as boolean} viewMode={viewMode} name={name} />
			{viewMode === FieldViewMode.EDIT && renderField()}
			{viewMode === FieldViewMode.VIEW && renderValue()}
			{viewMode === FieldViewMode.DIFF && renderDiff()}
			<FieldHint hint={fieldConfiguration?.hint as string} />
		</div>
	);
};
