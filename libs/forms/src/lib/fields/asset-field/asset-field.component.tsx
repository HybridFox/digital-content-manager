import { FC, useState } from 'react';
import { Controller, ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, UseFormStateReturn, useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';

import { FieldLabel } from '../../field-label/field-label.component';
import { SelectAssetModal } from '../../modals';

import { IAssetFieldProps } from './asset-field.types';
import styles from './asset-field.module.scss';

const cxBind = cx.bind(styles);

export const AssetField: FC<IAssetFieldProps> = ({ name, label, fieldConfiguration, field }: IAssetFieldProps) => {
	const { control } = useFormContext();
	const [modalOpen, setModalOpen] = useState(false);
	const { siteId } = useParams();

	const renderImage = (storageRepositoryId: string, path: string) => (
		<div className={classNames('u-margin-bottom-sm', cxBind('a-input__field'))} onClick={() => setModalOpen(true)} key={path}>
			<div className={cxBind('a-input__image')}>
				<img src={`/admin-api/v1/sites/${siteId}/storage-repositories/${storageRepositoryId}/files?path=${path}`} alt="preview" />
				<div className={cxBind('a-input__image__overlay')}>
					<span className="las la-pen"></span>
				</div>
			</div>
			<div className={cxBind('a-input__data')}>
				<p>{path}</p>
			</div>
		</div>
	);

	const renderField = ({
		field: { onChange, value },
		formState: { errors },
	}: {
		field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
		fieldState: ControllerFieldState;
		formState: UseFormStateReturn<FieldValues>;
	}) => {
		const error = errors?.[name];

		const handleSubmit = (selection: string | string[]) => {
			onChange(selection);
			setModalOpen(false);
		};

		return (
			<div
				className={cxBind('a-input', {
					'a-input--has-error': !!error,
				})}
			>
				<FieldLabel label={label} multiLanguage={fieldConfiguration?.multiLanguage as boolean} name={name} />
				{value && (
					<div className={cxBind('a-input__images')}>
						{value && !Array.isArray(value) && renderImage(value.storageRepositoryId, value.path)}
						{value && Array.isArray(value) && value.map((item) => renderImage(item.storageRepositoryId, item.path))}
					</div>
				)}
				{!value && (
					<div className={cxBind('a-input__add')} onClick={() => setModalOpen(true)}>
						<span className="las la-plus"></span>
						<p>Add asset</p>
					</div>
				)}
				<SelectAssetModal
					siteId={siteId!}
					modalOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					onSubmit={handleSubmit}
					min={field?.min}
					max={field?.max}
					defaultSelection={value}
				/>
			</div>
		);
	};

	return (
		<div className={cxBind('a-input__field-wrapper')}>
			<Controller control={control} name={name} render={renderField} />
		</div>
	);
};
