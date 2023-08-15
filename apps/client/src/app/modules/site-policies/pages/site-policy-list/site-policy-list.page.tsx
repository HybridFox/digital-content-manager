import { useEffect } from 'react';
import { useHeaderStore, useSitePolicyStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { POLICY_LIST_COLUMNS } from './site-policy-list.const';

export const SitePolicyListPage = () => {
	const [policies, policiesLoading, fetchPolicies] = useSitePolicyStore((state) => [
		state.policies,
		state.policiesLoading,
		state.fetchPolicies,
	]);
	const [removePolicy] = useSitePolicyStore((state) => [
		state.removePolicy,
	]);
	const { t } = useTranslation();
	const { kind, siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		fetchPolicies(siteId!);
		setBreadcrumbs([{ label: t(`BREADCRUMBS.SITE_POLICIES`) }]);
	}, [kind]);

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
			</Loading>
		</>
	);
};
