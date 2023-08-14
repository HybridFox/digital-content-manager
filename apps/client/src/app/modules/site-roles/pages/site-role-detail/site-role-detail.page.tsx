import {
	IAPIError,
	useHeaderStore,
	useSitePolicyStore,
	useSiteRoleStore,
} from '@ibs/shared';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckboxField, TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SITE_ROLE_PATHS } from '../../site-roles.routes';

import { updateRoleSchema } from './site-role-detail.const';

interface UpdateRoleForm {
	name: string;
	policies: string[];
}

export const SiteRoleDetailPage = () => {
	const [policies, policiesLoading, fetchPolicies] = useSitePolicyStore((state) => [
		state.policies,
		state.policiesLoading,
		state.fetchPolicies,
	]);
	const [role, roleLoading, fetchRole] = useSiteRoleStore((state) => [
		state.role,
		state.roleLoading,
		state.fetchRole,
	]);
	const [updateRoleLoading, updateRole] = useSiteRoleStore((state) => [
		state.updateRoleLoading,
		state.updateRole,
	]);
	const { roleId, siteId } = useParams();
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

		fetchPolicies(siteId!);
		fetchRole(siteId!, roleId);
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.SITE_ROLES`), to: SITE_ROLE_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`) },
		]);
	}, []);

	const onSubmit = (values: UpdateRoleForm) => {
		if (!roleId) {
			return;
		}
	
		updateRole(siteId!, roleId, values)
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
				title={t('SITE_ROLES.TITLES.EDIT')}
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
								<CheckboxField name='policies' fieldConfiguration={{ options: policies.map((policy) => ({ label: policy.name, value: policy.id })) }} />
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
