import {
	IAPIError,
	PERMISSION_EFFECT,
	useHeaderStore,
	usePolicyStore,
} from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useRoleStore } from '../../stores/role';
import { ROLE_PATHS } from '../../roles.routes';

import { updateRoleSchema } from './role-detail.const';

interface UpdateRoleForm {
	name: string;
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
		values: role,
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
			{ label: t(`BREADCRUMBS.CREATE`) },
		]);
	}, []);
	
	console.log(errors)

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
				title={t('WORKFLOW_STATES.TITLES.CREATE')}
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
							<Button htmlType={HTMLButtonTypes.SUBMIT}>
								{updateRoleLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
