import { FC, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { IContentComponentsFieldProps } from './content-components-field.types';
import styles from './content-components-field.module.scss';

import { useContentComponentStore } from '~shared';
import { IRenderControllerField } from '~forms';


const cxBind = cx.bind(styles);

export const ContentComponentsField: FC<IContentComponentsFieldProps> = ({ name, label, placeholder, fieldConfiguration, fieldOptions, siteId }: IContentComponentsFieldProps) => {
	const {
		control
	} = useFormContext();
	const [contentComponents, contentComponentsLoading, fetchContentComponents] = useContentComponentStore((state) => [state.contentComponents, state.contentComponents, state.fetchContentComponents]);

	useEffect(() => {
		if (!siteId) {
			return;
		}

		fetchContentComponents(siteId, { pagesize: -1, includeInternal: true });
	}, [])

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
					{(contentComponents || []).map((option, i) => (
						<div className={cxBind('a-input__field')} key={option.id}>
							<input
								type="checkbox"
								id={option.id}
								checked={(value || []).includes(option.id)}
								onChange={(e) => handleChange(option.id as any)}
								className={cxBind('a-input__radio')}
							/>
							<label htmlFor={option.id}>{option.name}</label>
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
		<Controller control={control} name={name} render={renderField} shouldUnregister={true} />
	);
};
