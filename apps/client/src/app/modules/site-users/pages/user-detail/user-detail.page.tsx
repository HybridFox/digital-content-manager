import { IAPIError, useHeaderStore, useSiteRoleStore } from '@ibs/shared';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { Trans, useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxField, TextField } from '@ibs/forms';

import { useSiteUserStore } from '../../stores/site-user';
import { SITE_USER_PATHS } from '../../site-users.routes';

import { editUserSchema } from './user-detail.const';

interface EditUserForm {
	roles: string[];
}

export const UserDetailPage = () => {
	const { t } = useTranslation();

	const [user, userLoading, fetchUser] = useSiteUserStore((state) => [
		state.user,
		state.userLoading,
		state.fetchUser,
	]);
	const [updateUserLoading, updateUser] = useSiteUserStore((state) => [
		state.updateUserLoading,
		state.updateUser,
	]);
	const [roles, rolesLoading, fetchRoles] = useSiteRoleStore((state) => [
		state.roles,
		state.rolesLoading,
		state.fetchRoles
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { userId, siteId } = useParams();
	const formMethods = useForm<EditUserForm>({
		resolver: yupResolver(editUserSchema),
		values: {
			...(user || {}),
			roles: (user?.roles || []).map((role) => role.id)
		},
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		fetchRoles(siteId!, { pagesize: -1 });
	}, [])

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.SITE_USERS`), to: SITE_USER_PATHS.ROOT }, { label: t(`BREADCRUMBS.EDIT`) }]);
	}, [user]);

	useEffect(() => {
		if (!userId) {
			return;
		}

		fetchUser(siteId!, userId);
	}, [userId]);

	const onSubmit = (values: EditUserForm) => {
		if (!userId) {
			return;
		}

		updateUser(siteId!, userId, values).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={
					<Trans t={t} i18nKey="SITE_USERS.TITLES.EDIT" values={{ userName: user?.name }} />
				}
			></Header>
			<div className="u-margin-top">
				<Loading loading={userLoading || rolesLoading} text="Loading data...">
					<FormProvider {...formMethods}>
						<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
							{errors?.root?.message}
						</Alert>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="u-margin-bottom">
								<TextField name="name" label="Name" disabled />
							</div>
							<div className="u-margin-bottom">
								<TextField name="email" label="Email" disabled />
							</div>
							<div className="u-margin-bottom">
								<CheckboxField name="roles" label="Roles" fieldConfiguration={{ options: roles.map((role) => ({ label: role.name, value: role.id })) }} />
							</div>
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateUserLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
