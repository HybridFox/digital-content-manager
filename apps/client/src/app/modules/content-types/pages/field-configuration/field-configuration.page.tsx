import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, RenderFields } from '~components';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';
import { editFieldSchema } from '../field-detail/field-detail.const';

import { CONTENT_TYPE_KINDS_TRANSLATIONS, IAPIError, useContentTypeFieldStore, useContentTypeStore, useHeaderStore } from '~shared';

interface IEditFieldForm {
	name: string;
	config: Record<string, unknown>;
	min: number;
	max: number;
	multiLanguage: boolean;
}

export const FieldConfigurationPage = () => {
	const { siteId } = useParams();
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [contentTypeField] = useContentTypeFieldStore((state) => [state.field]);
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const [updateField, updateFieldLoading] = useContentTypeFieldStore((state) => [state.updateField, state.updateFieldLoading]);
	const formMethods = useForm<IEditFieldForm>({
		resolver: yupResolver(editFieldSchema),
		values: contentTypeField,
	});

	useEffect(() => {
		setBreadcrumbs([
			{ label: 'Content Types', to: generatePath(CONTENT_TYPES_PATHS.ROOT, { siteId }) },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
				to: generatePath(CONTENT_TYPES_PATHS.DETAIL, {
					contentTypeId: contentType?.id || '',
					siteId,
				}),
			},
			{
				label: 'Content Components',
				to: generatePath(CONTENT_TYPES_PATHS.DETAIL_CC, {
					contentTypeId: contentType?.id || '',
					siteId,
				}),
			},
			{
				label: contentTypeField?.name,
				to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL, {
					contentTypeId: contentType?.id || '',
					fieldId: contentTypeField?.id || '',
					siteId,
				}),
			},
			{
				label: 'Configuration',
			},
		]);
	}, [contentType, contentTypeField]);

	const {
		handleSubmit,
		setError,
		formState: { errors },
	} = formMethods;

	const onSubmit = (values: IEditFieldForm) => {
		if (!contentType || !contentTypeField) {
			return;
		}

		updateField(siteId!, contentType.id, contentTypeField?.id, values).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	return (
		<FormProvider {...formMethods}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
					{errors?.root?.message}
				</Alert>
				<RenderFields siteId={siteId!} fieldPrefix="config." fields={contentTypeField?.contentComponent?.configurationFields || []} />
				<div className="u-margin-top">
					<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
						{updateFieldLoading && <i className="las la-redo-alt la-spin"></i>} Save
					</Button>
				</div>
			</form>
		</FormProvider>
	);
};
