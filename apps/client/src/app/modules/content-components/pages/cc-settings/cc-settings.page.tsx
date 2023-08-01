import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	Alert,
	AlertTypes,
	Button,
	HTMLButtonTypes,
} from '@ibs/components';
import { IAPIError, useContentComponentStore, useHeaderStore } from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath } from 'react-router-dom';
import { TextField, TextareaField } from '@ibs/forms';

import { CONTENT_COMPONENTS_PATHS } from '../../content-components.routes';

import { editContentComponent } from './cc-settings.const';

interface IEditContentComponentForm {
	name: string;
	description: string | undefined
}

export const CCSettingsPage = () => {
	const [contentComponent, updateContentComponent, updateContentComponentLoading] =
		useContentComponentStore((state) => [
			state.contentComponent,
			state.updateContentComponent,
			state.updateContentComponentLoading,
		]);
	const formMethods = useForm<IEditContentComponentForm>({
		resolver: yupResolver(editContentComponent),
		defaultValues: contentComponent,
	});
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);

	const {
		handleSubmit,
		setError,
		formState: { errors },
	} = formMethods;

	const onSubmit = (values: IEditContentComponentForm) => {
		if (!contentComponent) {
			return;
		}

		updateContentComponent(contentComponent.id, values).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	useEffect(() => {
		setBreadcrumbs([
			{ label: 'Content Components', to: CONTENT_COMPONENTS_PATHS.ROOT },
			{
				label: contentComponent?.name,
				to: generatePath(CONTENT_COMPONENTS_PATHS.DETAIL, {
					contentComponentId: contentComponent?.id || '',
				}),
			},
			{ label: 'Settings' },
		]);
	}, [contentComponent]);

	return (
		<FormProvider {...formMethods}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
					{errors?.root?.message}
				</Alert>
				<TextField name="name" label="Name"></TextField>
				<div className="u-margin-top">
					<TextareaField
						name="description"
						label="Description"
					></TextareaField>
				</div>
				<div className="u-margin-top">
					<Button htmlType={HTMLButtonTypes.SUBMIT}>
						{updateContentComponentLoading && (
							<i className="las la-redo-alt la-spin"></i>
						)}{' '}
						Save
					</Button>
				</div>
			</form>
		</FormProvider>
	);
};
