import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { RenderFields } from '~components';

import { CONTENT_COMPONENT_PATHS } from '../../content-components.routes';

import { useContentComponentFieldStore, useContentComponentStore, useHeaderStore } from '~shared';


export const CCFieldConfigurationPage = () => {
	const [contentComponent] =
		useContentComponentStore((state) => [
			state.contentComponent,
		]);
	const [contentComponentField] =
		useContentComponentFieldStore((state) => [
			state.field,
		]);
	const { siteId } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);

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
			}
		]);
	}, [contentComponent, contentComponentField]);

	return (
		<div className="u-margin-top">
			<RenderFields siteId={siteId!} fieldPrefix='config.' fields={contentComponentField?.contentComponent?.configurationFields || []} />
		</div>
	);
};
