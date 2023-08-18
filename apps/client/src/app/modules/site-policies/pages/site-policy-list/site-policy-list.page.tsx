import { useEffect } from 'react';
import { getPageParams, getPaginationProps, useHeaderStore, useSitePolicyStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { POLICY_LIST_COLUMNS } from './site-policy-list.const';

export const SitePolicyListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [policies, policiesPagination, policiesLoading, fetchPolicies] = useSitePolicyStore((state) => [
		state.policies,
		state.policiesPagination,
		state.policiesLoading,
		state.fetchPolicies,
	]);
	const [removePolicy] = useSitePolicyStore((state) => [
		state.removePolicy,
	]);
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.SITE_POLICIES`) }]);
	}, []);

	useEffect(() => {
		fetchPolicies(siteId!, { ...getPageParams(searchParams) });
	}, [searchParams])

	const handleRemove = (policyId: string): void => {
		removePolicy(siteId!, policyId).then(() => fetchPolicies(siteId!));
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`SITE_POLICIES.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t(`SITE_POLICIES.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={policiesLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={POLICY_LIST_COLUMNS(t, handleRemove)} rows={policies || []}></Table>
				<Pagination
					className="u-margin-top"
					totalPages={policiesPagination?.totalPages}
					number={policiesPagination?.number}
					size={policiesPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
