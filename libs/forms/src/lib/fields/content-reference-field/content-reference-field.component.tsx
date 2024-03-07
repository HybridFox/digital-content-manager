import { FC, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';

import { Select } from '~components';

import { IRenderControllerField } from '../fields.types';
import { FieldLabel } from '../../field-label/field-label.component';

import { IContentReferenceFieldProps } from './content-reference-field.types';
import styles from './content-reference-field.module.scss';

import { useContentStore } from '~shared';

const cxBind = cx.bind(styles);

interface IContentReferenceValue {
	contentId: string;
	translationId: string
}

interface IContentReferenceOption {
	label: string;
	value: IContentReferenceValue;
}

export const ContentReferenceField: FC<IContentReferenceFieldProps> = ({
	name,
	label,
	placeholder,
	fieldConfiguration,
	field,
	disabled,
	siteId,
}: IContentReferenceFieldProps) => {
	const { control } = useFormContext();
	const { contentId } = useParams(); 
	const [content, contentLoading, fetchContent] = useContentStore((state) => [state.content, state.contentLoading, state.fetchContent]);

	useEffect(() => {
		if (!siteId) {
			return;
		}

		fetchContent(siteId, { pagesize: -1, contentTypes: fieldConfiguration?.['content-types'] as string[] });
	}, []);

	const options = (content || []).filter((contentItem) => contentItem.id !== contentId).map((contentItem) => ({
		label: `${contentItem.name}`,
		value: {
			contentId: contentItem.id,
			translationId: contentItem.translationId,
		},
	}));

	const getMappedValue = (value: IContentReferenceValue): IContentReferenceOption | IContentReferenceOption[] | undefined => {
		if (!value) {
			return undefined;
		}

		if (Array.isArray(value)) {
			return options.filter((option) => value.map((ct) => ct?.contentId).includes(option?.value?.contentId));
		}

		return options.find((option) => option?.value?.contentId === value?.contentId as string);
	};

	const renderField = ({ field: { onChange, value }, formState: { errors } }: IRenderControllerField) => {
		const mappedValue = getMappedValue(value);

		return (
			<div
				className={cxBind('a-input', {
					'a-input--has-error': !!errors?.[name],
				})}
			>
				<FieldLabel label={label} />
				<div className={classNames(cxBind('a-input__field-wrapper'), 'a-input__field-wrapper')}>
					<Select
						loading={contentLoading}
						disabled={disabled}
						min={field?.min ?? 1}
						max={field?.max ?? 1}
						hasError={!!errors?.[name]}
						onChange={onChange}
						value={mappedValue}
						options={options}
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
