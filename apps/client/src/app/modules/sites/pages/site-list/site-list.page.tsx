import { useEffect } from 'react';
import { useHeaderStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useSiteStore } from '../../stores/site';

import { ROLE_LIST_COLUMNS } from './site-list.const';

export const SiteListPage = () => {
	const [sites, sitesLoading, fetchSites] = useSiteStore((state) => [
		state.sites,
		state.sitesLoading,
		state.fetchSites,
	]);
	const [removeSite] = useSiteStore((state) => [
		state.removeSite
	]);
	const { t } = useTranslation();
	const { kind } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		fetchSites();
		setBreadcrumbs([{ label: t(`BREADCRUMBS.SITES`) }]);
	}, [kind]);

	const handleRemove = (roleId: string): void => {
		removeSite(roleId).then(() => fetchSites());
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`SITES.TITLES.LIST`)}
				action={
					<ButtonLink to="create">
						<span className="las la-plus"></span> {t(`SITES.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={sitesLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={ROLE_LIST_COLUMNS(t, handleRemove)} rows={sites || []}></Table>
			</Loading>
		</>
	);
};
