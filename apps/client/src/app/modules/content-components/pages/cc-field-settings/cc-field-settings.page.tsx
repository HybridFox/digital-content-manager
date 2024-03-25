import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes } from '~components';

import { CONTENT_COMPONENT_PATHS } from '../../content-components.routes';
import { editFieldSchema } from '../cc-field-detail/cc-field-detail.const';

import { NumberField, TextField, TextareaField, ToggleField } from '~forms';
import { useContentComponentFieldStore, useContentComponentStore, useHeaderStore } from '~shared';

interface IEditFieldForm {
	name: string;
	config: Record<string, unknown>;
	min: number;
	max: number;
	multiLanguage: boolean;
}

export const CCFieldSettingsPage = () => {
	const { siteId } = useParams();
	const [contentComponent] = useContentComponentStore((state) => [state.contentComponent]);
	const [contentComponentField] = useContentComponentFieldStore((state) => [state.field]);
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const formMethods = useForm<IEditFieldForm>({
		resolver: yupResolver(editFieldSchema),
		values: contentComponentField,
	});
	const [updateField, updateFieldLoading] = useContentComponentFieldStore((state) => [state.updateField, state.updateFieldLoading]);

	const {
		handleSubmit,
		formState: { errors },
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([
			{ label: 'Content Components', to: generatePath(CONTENT_COMPONENT_PATHS.ROOT, { siteId }) },
			{
				label: contentComponent?.name,
				to: generatePath(CONTENT_COMPONENT_PATHS.DETAIL, {
					contentComponentId: contentComponent?.id || '',
					siteId,
				}),
			},
			{
				label: 'Content Components',
				to: generatePath(CONTENT_COMPONENT_PATHS.DETAIL_CC, {
					contentComponentId: contentComponent?.id || '',
					siteId,
				}),
			},
			{
				label: contentComponentField?.name,
				to: generatePath(CONTENT_COMPONENT_PATHS.FIELD_DETAIL, {
					contentComponentId: contentComponent?.id || '',
					fieldId: contentComponentField?.id || '',
					siteId,
				}),
			},
			{
				label: 'Settings',
			},
		]);
	}, [contentComponent, contentComponentField]);

	const onSubmit = (values: IEditFieldForm) => {
		if (!contentComponent || !contentComponentField) {
			return;
		}

		updateField(siteId!, contentComponent.id!, contentComponentField?.id, values);
	};

	return (
		<FormProvider {...formMethods}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
					{errors?.root?.message}
				</Alert>
				<TextField name="name" label="Name" />
				<div className="u-margin-top">
					<TextareaField name="description" label="Description"></TextareaField>
				</div>
				<div className="u-margin-top">
					<NumberField name="min" label="Min"></NumberField>
				</div>
				<div className="u-margin-top">
					<NumberField name="max" label="Max"></NumberField>
				</div>
				<div className="u-margin-top">
					<ToggleField name="multiLanguage" label="Multi Language"></ToggleField>
				</div>
				<div className="u-margin-top">
					<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
						{updateFieldLoading && <i className="las la-redo-alt la-spin"></i>} Save
					</Button>
				</div>
			</form>
		</FormProvider>
	);
};
