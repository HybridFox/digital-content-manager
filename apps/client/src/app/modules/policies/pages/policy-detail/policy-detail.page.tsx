import {
	IAPIError,
	PERMISSION_EFFECT,
	useHeaderStore,
	useIAMActionStore,
	usePolicyStore,
} from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { POLICY_PATHS } from '../../policies.routes';
import { PermissionManager } from '../../components/permission-manager';

import { createPolicySchema } from './policy-detail.const';

interface UpdatePolicyForm {
	name: string;
	permissions: {
		effect: PERMISSION_EFFECT,
		resources: string[];
		actions: string[];
	}[]
}

export const PolicyDetailPage = () => {
	const [updatePolicy, updatePolicyLoading] = usePolicyStore((state) => [
		state.updatePolicy,
		state.updatePolicyLoading,
	]);
	const [policy, policyLoading, fetchPolicy] = usePolicyStore((state) => [
		state.policy,
		state.policyLoading,
		state.fetchPolicy,
	]);
	const [iamActions, iamActionsLoading, fetchIAMActions] = useIAMActionStore((state) => [
		state.iamActions,
		state.iamActionsLoading,
		state.fetchIAMActions,
	])
	const { policyId } = useParams();
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

		fetchPolicy(policyId);
		fetchIAMActions({ pagesize: -1, kind: 'root' });
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.POLICIES`), to: POLICY_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`) },
		]);
	}, []);

	const onSubmit = (values: UpdatePolicyForm) => {
		if (!policyId) {
			return;
		}
	
		updatePolicy(policyId, values)
			.then((policy) => navigate(generatePath(POLICY_PATHS.DETAIL, { policyId: policy.id })))
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
				title={t('POLICIES.TITLES.CREATE')}
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
