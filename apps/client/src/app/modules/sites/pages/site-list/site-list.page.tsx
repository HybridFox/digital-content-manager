import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { ButtonLink, ButtonTypes, HasPermission, Header, Loading, Pagination, Table } from '~components';

import { useSiteStore } from '../../stores/site';

import { ROLE_LIST_COLUMNS } from './site-list.const';

import { getPageParams, getPaginationProps, useHeaderStore } from '~shared';

export const SiteListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [sites, sitesPagination, sitesLoading, fetchSites] = useSiteStore((state) => [
		state.sites,
		state.sitesPagination,
		state.sitesLoading,
		state.fetchSites,
	]);
	const [removeSite] = useSiteStore((state) => [
		state.removeSite
	]);
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.SITES`) }]);
	}, []);

	useEffect(() => {
		fetchSites({ ...getPageParams(searchParams) });
	}, [searchParams])

	const handleRemove = (roleId: string): void => {
		removeSite(roleId).then(() => fetchSites());
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`SITES.TITLES.LIST`)}
				action={
					<HasPermission action='root::sites:create' resource='*'>
						<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
							<span className="las la-plus"></span> {t(`SITES.ACTIONS.CREATE`)}
						</ButtonLink>
					</HasPermission>
				}
			></Header>
			<Loading loading={sitesLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={ROLE_LIST_COLUMNS(t, handleRemove)} rows={(sites || []).filter((site) => site.hasPermission)}></Table>
				<Pagination
					className="u-margin-top"
					totalPages={sitesPagination?.totalPages}
					number={sitesPagination?.number}
					size={sitesPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
