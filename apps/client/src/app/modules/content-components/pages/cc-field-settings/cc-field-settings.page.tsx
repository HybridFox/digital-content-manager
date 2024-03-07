import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { CONTENT_COMPONENT_PATHS } from '../../content-components.routes';

import { NumberField, TextField, TextareaField, ToggleField } from '~forms';
import { useContentComponentFieldStore, useContentComponentStore, useHeaderStore } from '~shared';

export const CCFieldSettingsPage = () => {
	const { siteId } = useParams();
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
			{ label: 'Content Components', to: CONTENT_COMPONENT_PATHS.ROOT },
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
