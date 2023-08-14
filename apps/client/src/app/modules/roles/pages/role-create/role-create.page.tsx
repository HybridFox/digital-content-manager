import {
	IAPIError,
	useHeaderStore,
	usePolicyStore,
	useRoleStore,
} from '@ibs/shared';
import { useEffect } from 'react';
import { CheckboxField, TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate } from 'react-router-dom';

import { ROLE_PATHS } from '../../roles.routes';

import { createRoleSchema } from './role-create.const';

interface CreateRoleForm {
	name: string;
	policies: string[];
}

export const RoleCreatePage = () => {
	const navigate = useNavigate();
	const [policies, policiesLoading, fetchPolicies] = usePolicyStore((state) => [
		state.policies,
		state.policiesLoading,
		state.fetchPolicies,
	]);
	const [createRoleLoading, createRole] = useRoleStore((state) => [
		state.createRoleLoading,
		state.createRole,
	]);
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const formMethods = useForm<CreateRoleForm>({
		resolver: yupResolver(createRoleSchema),
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		fetchPolicies();
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.ROLES`), to: ROLE_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`) },
		]);
	}, []);

	const onSubmit = (values: CreateRoleForm) => {
		createRole(values)
			.then((role) => navigate(generatePath(ROLE_PATHS.DETAIL, { roleId: role.id })))
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
				<Loading loading={policiesLoading}>
					<FormProvider {...formMethods}>
						<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
							{errors?.root?.message}
						</Alert>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="u-margin-bottom">
								<TextField name="name" label="Name" />
							</div>
							<div className="u-margin-bottom">
								<CheckboxField name='policies' fieldConfiguration={{ options: policies.map((policy) => ({ label: policy.name, value: policy.id })) }} label='Roles' />
							</div>
							<Button htmlType={HTMLButtonTypes.SUBMIT} disabled={!!Object.keys(errors).length}>
								{createRoleLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
