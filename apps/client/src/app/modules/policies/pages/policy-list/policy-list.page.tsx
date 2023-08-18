import { useEffect } from 'react';
import { getPageParams, getPaginationProps, useHeaderStore, usePolicyStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { POLICY_LIST_COLUMNS } from './policy-list.const';

export const PolicyListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [policies, policiesPagination, policiesLoading, fetchPolicies] = usePolicyStore((state) => [
		state.policies,
		state.policiesPagination,
		state.policiesLoading,
		state.fetchPolicies,
	]);
	const [removePolicy] = usePolicyStore((state) => [
		state.removePolicy,
	]);
	const { t } = useTranslation();
	const { kind } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.POLICIES`) }]);
	}, [kind]);

	useEffect(() => {
		fetchPolicies({ ...getPageParams(searchParams) });
	}, [])

	const handleRemove = (policyId: string): void => {
		removePolicy(policyId).then(() => fetchPolicies());
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`POLICIES.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t(`POLICIES.ACTIONS.CREATE`)}
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
