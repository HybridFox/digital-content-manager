import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';

import { Header, Loading } from '~components';

import { useSiteStore } from '../../stores/site';

import { SITE_DETAIL_TABS } from './site-detail.const';

import {
	useHeaderStore,
	useLanguageStore
} from '~shared';

export const SiteDetailPage = () => {
	const [languagesLoading, fetchLanguages] = useLanguageStore((state) => [
		state.languagesLoading,
		state.fetchLanguages,
	]);
	const [site, siteLoading, fetchSite] = useSiteStore((state) => [state.site, state.siteLoading, state.fetchSite]);
	const { rootSiteId } = useParams();
	const { t } = useTranslation();
	const [breadcrumbs] = useHeaderStore((state) => [state.breadcrumbs]);

	useEffect(() => {
		fetchLanguages({ pagesize: -1 });
	}, []);

	useEffect(() => {
		if (!rootSiteId) {
			return;
		}

		fetchSite(rootSiteId);
	}, [rootSiteId]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={<Trans t={t} i18nKey="SITES.TITLES.EDIT" values={{ siteName: site?.name || '...' }} />}
				tabs={SITE_DETAIL_TABS(t, rootSiteId!)}
			></Header>
			<div className="u-margin-top">
				<Loading loading={languagesLoading || siteLoading}>
					<Outlet />
				</Loading>
			</div>
		</>
	);
};
