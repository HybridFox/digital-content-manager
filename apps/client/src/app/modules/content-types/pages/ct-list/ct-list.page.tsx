import { useEffect } from 'react';
import { useContentTypeStore, useHeaderStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, Header, Loading, Table } from '@ibs/components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { CONTENT_TYPE_LIST_COLUMNS } from './ct-list.const';

export const CTListPage = () => {
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [contentTypes, contentTypesLoading, fetchContentTypes] =
		useContentTypeStore((state) => [
			state.contentTypes,
			state.contentTypesLoading,
			state.fetchContentTypes,
		]);
	const [breadcrumbs, setBreadcrumbs] =
		useHeaderStore((state) => [
			state.breadcrumbs,
			state.setBreadcrumbs
		]);

	useEffect(() => {
		fetchContentTypes(siteId!);
		setBreadcrumbs([{ label: t('BREADCRUMBS.CONTENT_TYPES') }])
	}, []);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t('CONTENT_TYPES.TITLES.LIST')}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t('CONTENT_TYPES.ACTIONS.CREATE')}
					</ButtonLink>
				}
			></Header>
			<Loading
				loading={contentTypesLoading}
			>
				<Table
					columns={CONTENT_TYPE_LIST_COLUMNS(t)}
					rows={contentTypes}
				></Table>
			</Loading>
		</>
	);
};
