import { useEffect } from 'react';
import { useHeaderStore, usePolicyStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { POLICY_LIST_COLUMNS } from './policy-list.const';

export const PolicyListPage = () => {
	const [policies, policiesLoading, fetchPolicies] = usePolicyStore((state) => [
		state.policies,
		state.policiesLoading,
		state.fetchPolicies,
	]);
	const [removePolicy] = usePolicyStore((state) => [
		state.removePolicy,
	]);
	const { t } = useTranslation();
	const { kind, siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		fetchPolicies(siteId!);
		setBreadcrumbs([{ label: t(`BREADCRUMBS.POLICIES`) }]);
	}, [kind]);

	const handleRemove = (policyId: string): void => {
		removePolicy(siteId!, policyId).then(() => fetchPolicies(siteId!));
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`POLICIES.TITLES.LIST`)}
				action={
					<ButtonLink to="create">
						<span className="las la-plus"></span> {t(`POLICIES.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={policiesLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={POLICY_LIST_COLUMNS(t, handleRemove)} rows={policies || []}></Table>
			</Loading>
		</>
	);
};
