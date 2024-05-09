import { FC, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { IRenderControllerField } from '../fields.types';

import { IContentTypesFieldProps } from './content-types-field.types';
import styles from './content-types-field.module.scss';

import { useContentTypeStore } from '~shared';


const cxBind = cx.bind(styles);

export const ContentTypesField: FC<IContentTypesFieldProps> = ({ name, label, placeholder, fieldConfiguration, fieldOptions, siteId }: IContentTypesFieldProps) => {
	const {
		control
	} = useFormContext();
	const [contentTypes, contentTypesLoading, fetchContentTypes] = useContentTypeStore((state) => [state.contentTypes, state.contentTypes, state.fetchContentTypes]);

	useEffect(() => {
		if (!siteId) {
			return;
		}

		fetchContentTypes(siteId, { pagesize: -1 });
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
					{(contentTypes || []).map((option, i) => (
						<div className={cxBind('a-input__field')} key={option.id}>
							<input
								type="checkbox"
								id={option.id}
								checked={(value || []).includes(option.id)}
								onChange={(e) => handleChange(option.id)}
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
		<Controller control={control} name={name} render={renderField} />
	);
};
