import { useEffect } from 'react';
import { useHeaderStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';

import { useResourceStore } from '../../stores/content';

import { CONTENT_LIST_COLUMNS } from './resource-list.const';

export const ResourceListPage = () => {
	const [resources, resourcesLoading, fetchResources] = useResourceStore((state) => [state.resources, state.resourcesLoading, state.fetchResources]);
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] =
		useHeaderStore((state) => [
			state.breadcrumbs,
			state.setBreadcrumbs
		]);

	useEffect(() => {
		fetchResources();
		setBreadcrumbs([{ label: t(`BREADCRUMBS.RESOURCES`) }])
	}, []);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`PAGES.RESOURCES.TITLE`)}
				action={
					<ButtonLink to="create">
						<span className="las la-plus"></span> {t(`PAGES.RESOURCES.CREATE_RESOURCE`)}
					</ButtonLink>
				}
			></Header>
			<Loading
				loading={resourcesLoading}
				text={t(`GENERAL.LOADING`)}
			>
				<Table
					columns={CONTENT_LIST_COLUMNS(t)}
					rows={resources || []}
				></Table>
			</Loading>
		</>
	);
};
