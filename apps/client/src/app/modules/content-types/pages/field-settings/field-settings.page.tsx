import { CONTENT_TYPE_KINDS_TRANSLATIONS, useContentTypeFieldStore, useContentTypeStore, useHeaderStore } from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath } from 'react-router-dom';
import { NumberField, TextField, TextareaField, ToggleField } from '@ibs/forms';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

export const FieldSettingsPage = () => {
	const [contentType] =
		useContentTypeStore((state) => [
			state.contentType,
		]);
	const [contentTypeField] =
		useContentTypeFieldStore((state) => [
			state.field,
		]);
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);

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
			{
				label: 'Content Components',
				to: generatePath(CONTENT_TYPES_PATHS.DETAIL_CC, {
					contentTypeId: contentType?.id || '',
				}),
			},
			{
				label: contentTypeField?.name,
				to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL, {
					contentTypeId: contentType?.id || '',
					fieldId: contentTypeField?.id || '',
				}),
			},
			{
				label: 'Settings',
			}
		]);
	}, [contentType, contentTypeField]);

	return (
		<>
			<TextField name="name" label="Name" />
			<div className="u-margin-top">
				<TextareaField
					name="description"
					label="Description"
				></TextareaField>
			</div>
			<div className="u-margin-top">
				<NumberField
					name="min"
					label="Min"
				></NumberField>
			</div>
			<div className="u-margin-top">
				<NumberField
					name="max"
					label="Max"
				></NumberField>
			</div>
			<div className="u-margin-top">
				<ToggleField
					name="multiLanguage"
					label="Multi Language"
				></ToggleField>
			</div>
		</>
	);
};
