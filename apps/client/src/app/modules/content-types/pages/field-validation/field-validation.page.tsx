import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';
import { ValidationForm } from '../../../core/forms/validation/validation.form';

import { CONTENT_TYPE_KINDS_TRANSLATIONS, IContentTypeFieldUpdateDTO, useContentTypeFieldStore, useContentTypeStore, useHeaderStore } from '~shared';

export const FieldValidationPage = () => {
	const { siteId } = useParams();
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [contentTypeField] = useContentTypeFieldStore((state) => [state.field]);
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const [updateField, updateFieldLoading] = useContentTypeFieldStore((state) => [state.updateField, state.updateFieldLoading]);

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
				label: 'Validation',
			},
		]);
	}, [contentType, contentTypeField]);

	const handleSubmit = (values: IContentTypeFieldUpdateDTO) => {
		if (!contentType || !contentTypeField) {
			return;
		}

		updateField(siteId!, contentType.id, contentTypeField?.id, values);
	};

	return (
		<ValidationForm onSubmit={handleSubmit} loading={updateFieldLoading} siteId={siteId!} contentTypeField={contentTypeField!} />
	);
};
