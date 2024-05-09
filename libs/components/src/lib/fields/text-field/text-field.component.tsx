import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { path } from 'rambda';

import { FieldLabel } from '../../field-helpers/field-label/field-label.component';
import { FieldHint } from '../../field-helpers/field-hint/field-hint.component';
import { FieldViewMode } from '../fields.types';
import { FieldValue } from '../../field-helpers/field-value/field-value.component';
import { FieldDiff } from '../../field-helpers/field-diff/field-diff.component';

import { ITextFieldProps } from './text-field.types';
import styles from './text-field.module.scss';
import { TextFieldTypes } from './text-field.const';

const cxBind = cx.bind(styles);

export const TextField: FC<ITextFieldProps> = ({
	name,
	type = TextFieldTypes.TEXT,
	label,
	placeholder,
	fieldOptions,
	fieldConfiguration,
	disabled,
	viewMode = FieldViewMode.EDIT
}: ITextFieldProps) => {
	const { register, formState: { errors } } = useFormContext();
	const error = path([...name?.split('.') || []])(errors);

	const renderField = () => (
		<div className={cxBind('a-input__field-wrapper')}>
			<input
				disabled={disabled || (fieldConfiguration?.disabled as boolean || false)}
				type={fieldConfiguration?.type as string || type}
				className={cxBind('a-input__field')}
				id={name}
				placeholder={placeholder}
				{...register(name, {
					...fieldOptions,
				})}
			/>
		</div>
	)

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
			<FieldLabel label={label} multiLanguage={fieldConfiguration?.multiLanguage as boolean} viewMode={viewMode} name={name} />
			{viewMode === FieldViewMode.EDIT && renderField()}
			{viewMode === FieldViewMode.VIEW && renderValue()}
			{viewMode === FieldViewMode.DIFF && renderDiff()}
			<FieldHint hint={fieldConfiguration?.hint as string} />
		</div>
	);
};
