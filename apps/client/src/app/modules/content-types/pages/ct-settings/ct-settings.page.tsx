import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	Alert,
	AlertTypes,
	Button,
	HTMLButtonTypes,
} from '@ibs/components';
import { CONTENT_TYPE_KINDS_TRANSLATIONS, IAPIError, useContentTypeStore, useHeaderStore } from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath } from 'react-router-dom';
import { TextField, TextareaField } from '@ibs/forms';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

import { editContentType } from './ct-settings.const';

interface IEditContentTypeForm {
	name: string;
	description: string | undefined;
	min: number;
	max: number;
	multiLanguage: boolean;
	hidden: boolean;
}

export const CTSettingsPage = () => {
	const [contentType, updateContentType, updateContentTypeLoading] =
		useContentTypeStore((state) => [
			state.contentType,
			state.updateContentType,
			state.updateContentTypeLoading,
		]);
	const formMethods = useForm<IEditContentTypeForm>({
		resolver: yupResolver(editContentType),
		defaultValues: contentType,
	});
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);

	const {
		handleSubmit,
		setError,
		formState: { errors },
	} = formMethods;

	const onSubmit = (values: IEditContentTypeForm) => {
		if (!contentType) {
			return;
		}

		updateContentType(contentType.id, values).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	useEffect(() => {
		setBreadcrumbs([
			{ label: 'Content Types', to: CONTENT_TYPES_PATHS.ROOT },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
				to: generatePath(CONTENT_TYPES_PATHS.DETAIL, {
					contentTypeId: contentType?.id || '',
				}),
			},
			{ label: 'Settings' },
		]);
	}, [contentType]);

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
						{updateContentTypeLoading && (
							<i className="las la-redo-alt la-spin"></i>
						)}{' '}
						Save
					</Button>
				</div>
			</form>
		</FormProvider>
	);
};
