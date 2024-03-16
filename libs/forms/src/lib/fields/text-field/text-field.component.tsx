import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip'

import { FieldLabel } from '../../field-label/field-label.component';
import { FieldHint } from '../../field-hint/field-hint.component';
import { FieldValue } from "../../field-value/field-value.component";
import { FIELD_VIEW_MODE } from '../fields.types';
import { FieldDiff } from '../../field-diff/field-diff.component';

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
	viewMode = FIELD_VIEW_MODE.EDIT
}: ITextFieldProps) => {
	const { register, formState: { errors } } = useFormContext();
	const error = errors?.[name];

	const renderValue = () => (
		<FieldValue name={name} />
	)

	const renderDiff = () => (
		<FieldDiff name={name} />
	)

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
	)

	return (
		<div className={cxBind('a-input', {
			'a-input--has-error': !!error
		})}>
			<FieldLabel label={label} multiLanguage={fieldConfiguration?.multiLanguage as boolean} viewMode={viewMode} name={name} />
			{viewMode === FIELD_VIEW_MODE.EDIT && renderField()}
			{viewMode === FIELD_VIEW_MODE.VIEW && renderValue()}
			{viewMode === FIELD_VIEW_MODE.DIFF && renderDiff()}
			<FieldHint hint={fieldConfiguration?.hint as string} />
		</div>
	);
};
