import {
	IAPIError,
	useHeaderStore,
	useSitePolicyStore,
	useSiteRoleStore,
} from '@ibs/shared';
import { useEffect } from 'react';
import { CheckboxField, TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { SITE_ROLE_PATHS } from '../../site-roles.routes';

import { createRoleSchema } from './site-role-create.const';

interface CreateRoleForm {
	name: string;
	policies: string[];
}

export const SiteRoleCreatePage = () => {
	const navigate = useNavigate();
	const [policies, policiesLoading, fetchPolicies] = useSitePolicyStore((state) => [
		state.policies,
		state.policiesLoading,
		state.fetchPolicies,
	]);
	const [createRoleLoading, createRole] = useSiteRoleStore((state) => [
		state.createRoleLoading,
		state.createRole,
	]);
	const { siteId } = useParams();
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
		fetchPolicies(siteId!);
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.SITE_ROLES`), to: SITE_ROLE_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`) },
		]);
	}, []);

	const onSubmit = (values: CreateRoleForm) => {
		createRole(siteId!, values)
			.then((role) => navigate(generatePath(SITE_ROLE_PATHS.DETAIL, { siteId, roleId: role.id })))
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
				title={t('SITE_ROLES.TITLES.CREATE')}
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
								<CheckboxField name='policies' fieldConfiguration={{ options: (policies || []).map((policy) => ({ label: policy.name, value: policy.id })) }} label='Policies' />
							</div>
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT} disabled={!!Object.keys(errors).length}>
								{createRoleLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
