import { useContentComponentFieldStore, useContentComponentStore, useHeaderStore } from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import { RenderFields } from '@ibs/forms';

import { CONTENT_COMPONENT_PATHS } from '../../content-components.routes';

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
				label: 'Configuration',
			}
		]);
	}, [contentComponent, contentComponentField]);

	return (
		<div className="u-margin-top">
			<RenderFields fieldPrefix='config.' fields={contentComponentField?.contentComponent?.configurationFields || []} />
		</div>
	);
};
