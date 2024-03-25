import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { CONTENT_COMPONENT_PATHS } from '../../content-components.routes';
import { ValidationForm } from '../../../core/forms/validation/validation.form';

import { IField, useContentComponentFieldStore, useContentComponentStore, useContentTypeFieldStore, useHeaderStore } from '~shared';

export const CCFieldValidationPage = () => {
	const { siteId } = useParams();
	const [contentComponent] = useContentComponentStore((state) => [state.contentComponent]);
	const [contentComponentField] = useContentComponentFieldStore((state) => [state.field]);
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const [updateField, updateFieldLoading] = useContentTypeFieldStore((state) => [state.updateField, state.updateFieldLoading]);

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
				label: 'Configuration',
			},
		]);
	}, [contentComponent, contentComponentField]);

	const handleSubmit = (values: IField) => {
		if (!contentComponent || !contentComponentField) {
			return;
		}

		updateField(siteId!, contentComponent.id!, contentComponentField?.id, values);
	};

	return (
		<ValidationForm onSubmit={handleSubmit} loading={updateFieldLoading} siteId={siteId!} contentTypeField={contentComponentField!} />
	);
};
