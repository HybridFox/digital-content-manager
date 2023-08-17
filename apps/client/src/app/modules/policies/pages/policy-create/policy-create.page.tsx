import {
	IAPIError,
	PERMISSION_EFFECT,
	useHeaderStore,
	useIAMActionStore,
	usePolicyStore,
} from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { POLICY_PATHS } from '../../policies.routes';
import { PermissionManager } from '../../components/permission-manager';

import { createPolicySchema } from './policy-create.const';

interface CreatePolicyForm {
	name: string;
	permissions: {
		effect: PERMISSION_EFFECT,
		resources: string[];
		actions: string[];
	}[]
}

export const PolicyCreatePage = () => {
	const [createPolicy, createPolicyLoading] = usePolicyStore((state) => [
		state.createPolicy,
		state.createPolicyLoading,
	]);
	const [iamActions, iamActionsLoading, fetchIAMActions] = useIAMActionStore((state) => [
		state.iamActions,
		state.iamActionsLoading,
		state.fetchIAMActions,
	])
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const formMethods = useForm<CreatePolicyForm>({
		resolver: yupResolver(createPolicySchema)
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		fetchIAMActions({ pagesize: -1, kind: 'root' });
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.POLICIES`), to: POLICY_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`) },
		]);
	}, []);

	const onSubmit = (values: CreatePolicyForm) => {
		createPolicy(values)
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
				<Loading loading={iamActionsLoading}>
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
								{createPolicyLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
