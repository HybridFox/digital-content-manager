import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip'

import { FieldLabel } from '../../field-label/field-label.component';
import { FieldHint } from '../../field-hint/field-hint.component';
import { FIELD_VIEW_MODE } from '../fields.types';
import { FieldValue } from '../../field-value/field-value.component';
import { FieldDiff } from '../../field-diff/field-diff.component';

import styles from './number-field.module.scss';
import { INumberFieldProps } from './number-field.types';

const cxBind = cx.bind(styles);

export const NumberField: FC<INumberFieldProps> = ({
	name,
	label,
	placeholder,
	fieldOptions,
	fieldConfiguration,
	viewMode = FIELD_VIEW_MODE.EDIT
}: INumberFieldProps) => {
	const { register, formState: { errors } } = useFormContext();
	const error = errors?.[name];

	const renderField = () => (
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
	);

	const renderValue = () => (
		<FieldValue name={name} />
	)

	const renderDiff = () => (
		<FieldDiff name={name} />
	)

	return (
		<div className={cxBind('a-input', {
			'a-input--has-error': !!error
		})}>
			<FieldLabel label={label} multiLanguage={fieldConfiguration?.multiLanguage as boolean} name={name} />
			{viewMode === FIELD_VIEW_MODE.EDIT && renderField()}
			{viewMode === FIELD_VIEW_MODE.VIEW && renderValue()}
			{viewMode === FIELD_VIEW_MODE.DIFF && renderDiff()}
			<FieldHint hint={fieldConfiguration?.hint as string} />
		</div>
	);
};
