import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '~components';

import { SITE_POLICY_PATHS } from '../../site-policies.routes';
import { PermissionManager } from '../../../policies/components/permission-manager';

import { createPolicySchema } from './site-policy-detail.const';

import { TextField } from '~forms';
import {
	IAPIError,
	PERMISSION_EFFECT,
	useHeaderStore,
	useIAMActionStore,
	useSitePolicyStore,
} from '~shared';

interface UpdatePolicyForm {
	name: string;
	permissions: {
		effect: PERMISSION_EFFECT,
		resources: string[];
		actions: string[];
	}[]
}

export const SitePolicyDetailPage = () => {
	const [updatePolicy, updatePolicyLoading] = useSitePolicyStore((state) => [
		state.updatePolicy,
		state.updatePolicyLoading,
	]);
	const [policy, policyLoading, fetchPolicy] = useSitePolicyStore((state) => [
		state.policy,
		state.policyLoading,
		state.fetchPolicy,
	]);
	const [iamActions, iamActionsLoading, fetchIAMActions] = useIAMActionStore((state) => [
		state.iamActions,
		state.iamActionsLoading,
		state.fetchIAMActions,
	])
	const { policyId, siteId } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const formMethods = useForm<UpdatePolicyForm>({
		resolver: yupResolver(createPolicySchema),
		values: policy,
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		if (!policyId) {
			return;
		}

		fetchPolicy(siteId!, policyId);
		fetchIAMActions({ pagesize: -1, kind: 'site' });
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.SITE_POLICIES`), to: SITE_POLICY_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`) },
		]);
	}, []);

	const onSubmit = (values: UpdatePolicyForm) => {
		if (!policyId) {
			return;
		}
	
		updatePolicy(siteId!, policyId, values)
			.then((policy) => navigate(generatePath(SITE_POLICY_PATHS.DETAIL, { siteId, policyId: policy.id })))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t('SITE_POLICIES.TITLES.EDIT')}
			></Header>
			<div className="u-margin-top">
				<Loading loading={iamActionsLoading || policyLoading}>
					<FormProvider {...formMethods}>
						<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
							{errors?.root?.message}
						</Alert>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="u-margin-bottom">
								<TextField name="name" label="Name" />
							</div>
							<PermissionManager name="permissions" iamActions={iamActions} />
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updatePolicyLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
