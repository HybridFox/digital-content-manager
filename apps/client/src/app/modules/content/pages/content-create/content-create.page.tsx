import { useEffect } from 'react';
import { CONTENT_TYPE_KINDS_PARAMETER_MAP, useContentTypeStore, useHeaderStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { CONTENT_PATHS } from '../../content.routes';

import { CONTENT_CREATE_COLUMNS } from './content-create.const';

export const ContentCreatePage = () => {
	const { kind } = useParams();
	const { t } = useTranslation();
	const [contentTypes, contentTypesLoading, fetchContentTypes] = useContentTypeStore((state) => [
		state.contentTypes,
		state.contentTypesLoading,
		state.fetchContentTypes,
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		if (!kind) {
			return;
		}

		fetchContentTypes({ pagesize: -1, kind: CONTENT_TYPE_KINDS_PARAMETER_MAP[kind] });
		setBreadcrumbs([{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT }, { label: t(`BREADCRUMBS.CREATE`) }]);
	}, []);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title="All Content Types"
				action={
					<ButtonLink to="create">
						<span className="las la-plus"></span> Select content type
					</ButtonLink>
				}
			></Header>
			<Loading loading={contentTypesLoading} text="Loading content types...">
				<Table columns={CONTENT_CREATE_COLUMNS} rows={contentTypes}></Table>
			</Loading>
		</>
	);
};
