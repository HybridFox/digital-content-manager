import { IAPIError, useHeaderStore, useRoleStore } from '@ibs/shared';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { Trans, useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxField, TextField } from '@ibs/forms';

import { useUserStore } from '../../stores/user';
import { USER_PATHS } from '../../users.routes';

import { editUserSchema } from './user-detail.const';

interface EditUserForm {
	roles: string[];
}

export const UserDetailPage = () => {
	const { t } = useTranslation();

	const [user, userLoading, fetchUser] = useUserStore((state) => [
		state.user,
		state.userLoading,
		state.fetchUser,
	]);
	const [updateUserLoading, updateUser] = useUserStore((state) => [
		state.updateUserLoading,
		state.updateUser,
	]);
	const [roles, rolesLoading, fetchRoles] = useRoleStore((state) => [
		state.roles,
		state.rolesLoading,
		state.fetchRoles
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { userId } = useParams();
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
		fetchRoles({ pagesize: -1 });
	}, [])

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.USERS`), to: USER_PATHS.ROOT }, { label: t(`BREADCRUMBS.EDIT`) }]);
	}, [user]);

	useEffect(() => {
		if (!userId) {
			return;
		}

		fetchUser(userId);
	}, [userId]);

	const onSubmit = (values: any) => {
		if (!userId) {
			return;
		}

		updateUser(userId, values).catch((error: IAPIError) => {
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
					<Trans t={t} i18nKey="WORKFLOW_STATES.TITLES.EDIT" values={{ userName: user?.name }} />
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
							<Button htmlType={HTMLButtonTypes.SUBMIT}>
								{updateUserLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
