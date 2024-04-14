import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import {
	Alert,
	AlertTypes,
	Button,
	ButtonTypes,
	HTMLButtonTypes,
} from '~components';
import { TextField, TextareaField } from '~components';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

import { editContentType } from './ct-settings.const';

import { CONTENT_TYPE_KINDS_TRANSLATIONS, IAPIError, useContentTypeStore, useHeaderStore } from '~shared';

interface IEditContentTypeForm {
	name: string;
	description: string | undefined;
}

export const CTSettingsPage = () => {
	const [contentType, updateContentType, updateContentTypeLoading] =
		useContentTypeStore((state) => [
			state.contentType,
			state.updateContentType,
			state.updateContentTypeLoading,
		]);
	const { siteId } = useParams();
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

		updateContentType(siteId!, contentType.id, values).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	useEffect(() => {
		setBreadcrumbs([
			{ label: 'Content Types', to: generatePath(CONTENT_TYPES_PATHS.ROOT, { siteId }) },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
				to: generatePath(CONTENT_TYPES_PATHS.DETAIL, {
					contentTypeId: contentType?.id || '',
					siteId
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
					<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
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
