import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '~components';

import { ROLE_PATHS } from '../../roles.routes';

import { updateRoleSchema } from './role-detail.const';

import { CheckboxField, TextField } from '~forms';
import {
	IAPIError,
	useHeaderStore,
	usePolicyStore,
	useRoleStore,
} from '~shared';

interface UpdateRoleForm {
	name: string;
	policies: string[];
}

export const RoleDetailPage = () => {
	const [policies, policiesLoading, fetchPolicies] = usePolicyStore((state) => [
		state.policies,
		state.policiesLoading,
		state.fetchPolicies,
	]);
	const [role, roleLoading, fetchRole] = useRoleStore((state) => [
		state.role,
		state.roleLoading,
		state.fetchRole,
	]);
	const [updateRoleLoading, updateRole] = useRoleStore((state) => [
		state.updateRoleLoading,
		state.updateRole,
	]);
	const { roleId } = useParams();
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const formMethods = useForm<UpdateRoleForm>({
		resolver: yupResolver(updateRoleSchema),
		values: {
			name: role?.name || '',
			policies: (role?.policies || []).map((policy) => policy.id)
		},
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		if (!roleId) {
			return;
		}

		fetchPolicies();
		fetchRole(roleId);
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.ROLES`), to: ROLE_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.EDIT`) },
		]);
	}, []);

	const onSubmit = (values: UpdateRoleForm) => {
		if (!roleId) {
			return;
		}
	
		updateRole(roleId, values)
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
				title={t('ROLES.TITLES.EDIT')}
			></Header>
			<div className="u-margin-top">
				<Loading loading={policiesLoading || roleLoading}>
					<FormProvider {...formMethods}>
						<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
							{errors?.root?.message}
						</Alert>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="u-margin-bottom">
								<TextField name="name" label="Name" />
							</div>
							<div className="u-margin-bottom">
								<CheckboxField name='policies' fieldConfiguration={{ options: policies.map((policy) => ({ label: policy.name, value: policy.id })) }} label='Policies' />
							</div>
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateRoleLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
