import { FC } from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip'
import ReactDatePicker from "react-datepicker";
import dayjs from "dayjs";

import { FieldLabel } from '../../field-label/field-label.component';
import { FieldHint } from '../../field-hint/field-hint.component';
import {FieldValue} from "../../field-value/field-value.component";
import {FIELD_VIEW_MODE, IRenderControllerField} from '../fields.types';

import { IDatetimeFieldProps } from './datetime-field.types';
import styles from './datetime-field.module.scss';

const cxBind = cx.bind(styles);

export const DatetimeField: FC<IDatetimeFieldProps> = ({
	name,
	label,
	placeholder,
	fieldOptions,
	fieldConfiguration,
	disabled,
	viewMode = FIELD_VIEW_MODE.EDIT
}: IDatetimeFieldProps) => {
	const { control } = useFormContext();

	const renderField = ({
		field: { onChange, value },
		formState: { errors },
	}: IRenderControllerField) => {
		const error = errors?.[name];

		return (
			<div className={cxBind('a-input', {
				'a-input--has-error': !!error
			})}>
				<FieldLabel label={label} multiLanguage={fieldConfiguration?.multiLanguage as boolean} viewMode={viewMode} name={name} />
				<div className={cxBind('a-input__field-wrapper')}>
					<ReactDatePicker
						selected={dayjs(value).toDate()}
						onChange={(date) => onChange(date)}
						timeInputLabel="Time:"
						dateFormat="dd/MM/yyyy HH:mm"
						showTimeInput
						className={cxBind('a-input__field')}
						wrapperClassName={cxBind('a-input__datepicker__wrapper')}
						showPopperArrow={false}
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
				<FieldHint hint={fieldConfiguration?.hint as string} />
			</div>
		)
	}

	return (
		<Controller control={control} name={name} render={renderField} />
	);
};
