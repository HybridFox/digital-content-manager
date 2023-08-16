import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip'

import { FieldLabel } from '../../field-label/field-label.component';

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
}: ITextFieldProps) => {
	const { register, formState: { errors } } = useFormContext();
	const error = errors?.[name];

	return (
		<div className={cxBind('a-input', {
			'a-input--has-error': !!error
		})}>
			<FieldLabel label={label} multiLanguage={fieldConfiguration?.multiLanguage as boolean} name={name} />
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
		</div>
	);
};
