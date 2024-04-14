import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { IToggleFieldProps } from './toggle-field.types';
import styles from './toggle-field.module.scss';

const cxBind = cx.bind(styles);

export const ToggleField: FC<IToggleFieldProps> = ({ name, label, fieldOptions }: IToggleFieldProps) => {
	const { control } = useFormContext();

	return (
		<div className={cxBind('a-input__field-wrapper')}>
			<Controller
				shouldUnregister={true}
				control={control}
				name={name}
				render={({ field: { onChange, value }, formState: { errors } }) => {
					const error = errors?.[name];

					return (
						<div
							className={cxBind('a-input', {
								'a-input--has-error': !!error,
							})}
						>
							{label && (
								<label htmlFor={name} className={cxBind('a-input__label')}>
									{label}
								</label>
							)}
							<input
								type="checkbox"
								className={cxBind('a-input__field')}
								id={name}
								onChange={(element) => onChange(element.target.checked)}
								checked={!!value}
							/>
							<label
								htmlFor={name}
								className={cxBind('a-input__toggle', {
									'a-input__toggle--checked': !!value,
								})}
							>
								<div className={cxBind('a-input__toggle__item')}></div>
							</label>
							{error && (
								<>
									<Tooltip anchorSelect={`#${name}-err-tooltip`}>{error.message?.toString()}</Tooltip>
									<div className={cxBind('a-input__error')} id={`${name}-err-tooltip`}>
										<i className="las la-exclamation-triangle"></i>
									</div>
								</>
							)}
						</div>
					)
				}}
			/>
		</div>
	);
};
