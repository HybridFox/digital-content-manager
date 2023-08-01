import { useContentComponentFieldStore, useContentComponentStore, useHeaderStore } from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath } from 'react-router-dom';
import { NumberField, TextField, TextareaField, ToggleField } from '@ibs/forms';

import { CONTENT_COMPONENTS_PATHS } from '../../content-components.routes';

export const CCFieldSettingsPage = () => {
	const [contentComponent] =
		useContentComponentStore((state) => [
			state.contentComponent,
		]);
	const [contentComponentField] =
		useContentComponentFieldStore((state) => [
			state.field,
		]);
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([
			{ label: 'Content Components', to: CONTENT_COMPONENTS_PATHS.ROOT },
			{
				label: contentComponent?.name,
				to: generatePath(CONTENT_COMPONENTS_PATHS.DETAIL, {
					contentComponentId: contentComponent?.id || '',
				}),
			},
			{
				label: 'Content Components',
				to: generatePath(CONTENT_COMPONENTS_PATHS.DETAIL_CC, {
					contentComponentId: contentComponent?.id || '',
				}),
			},
			{
				label: contentComponentField?.name,
				to: generatePath(CONTENT_COMPONENTS_PATHS.FIELD_DETAIL, {
					contentComponentId: contentComponent?.id || '',
					fieldId: contentComponentField?.id || '',
				}),
			},
			{
				label: 'Settings',
			}
		]);
	}, [contentComponent, contentComponentField]);

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
