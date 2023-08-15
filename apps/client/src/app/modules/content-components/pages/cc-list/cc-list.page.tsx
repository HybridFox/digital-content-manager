import { useEffect } from 'react';
import { useContentComponentStore, useHeaderStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { CONTENT_COMPONENTS_LIST_COLUMNS } from './cc-list.const';

export const CCListPage = () => {
	const [contentComponents, contentComponentsLoading, fetchContentComponents] = useContentComponentStore((state) => [state.contentComponents, state.contentComponentsLoading, state.fetchContentComponents]);
	const { t } = useTranslation();
	const { kind, siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] =
		useHeaderStore((state) => [
			state.breadcrumbs,
			state.setBreadcrumbs
		]);

	useEffect(() => {
		fetchContentComponents(siteId!, {});
		setBreadcrumbs([{ label: t(`BREADCRUMBS.CONTENT_COMPONENTS`) }])
	}, [kind]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`CONTENT-COMPONENTS.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t(`CONTENT-COMPONENTS.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading
				loading={contentComponentsLoading}
				text={t(`GENERAL.LOADING`)}
			>
				<Table
					columns={CONTENT_COMPONENTS_LIST_COLUMNS(t)}
					rows={contentComponents}
				></Table>
			</Loading>
		</>
	);
};
