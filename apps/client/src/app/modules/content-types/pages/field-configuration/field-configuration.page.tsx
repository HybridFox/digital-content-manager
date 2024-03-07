import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { RenderFields } from '~components';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

import { CONTENT_TYPE_KINDS_TRANSLATIONS, useContentTypeFieldStore, useContentTypeStore, useHeaderStore } from '~shared';


export const FieldConfigurationPage = () => {
	const { siteId } = useParams();
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
					siteId
				}),
			},
			{
				label: 'Content Components',
				to: generatePath(CONTENT_TYPES_PATHS.DETAIL_CC, {
					contentTypeId: contentType?.id || '',
					siteId
				}),
			},
			{
				label: contentTypeField?.name,
				to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL, {
					contentTypeId: contentType?.id || '',
					fieldId: contentTypeField?.id || '',
					siteId
				}),
			},
			{
				label: 'Configuration',
			}
		]);
	}, [contentType, contentTypeField]);

	return (
		<div className="u-margin-top">
			<RenderFields siteId={siteId!} fieldPrefix='config.' fields={contentTypeField?.contentComponent?.configurationFields || []} />
		</div>
	);
};
