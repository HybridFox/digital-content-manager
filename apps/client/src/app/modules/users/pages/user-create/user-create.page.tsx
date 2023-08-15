import { IAPIError, useHeaderStore, useRoleStore } from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { Trans, useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxField, TextField, TextFieldTypes } from '@ibs/forms';

import { useUserStore } from '../../stores/user';
import { USER_PATHS } from '../../users.routes';

import { editUserSchema } from './user-create.const';

interface CreateUserForm {
	email: string;
	name: string;
	password: string;
	roles: string[];
}

export const UserCreatePage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [user, userLoading, fetchUser] = useUserStore((state) => [state.user, state.userLoading, state.fetchUser]);
	const [createUserLoading, createUser] = useUserStore((state) => [state.createUserLoading, state.createUser]);
	const [roles, rolesLoading, fetchRoles] = useRoleStore((state) => [state.roles, state.rolesLoading, state.fetchRoles]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { userId } = useParams();
	const formMethods = useForm<CreateUserForm>({
		resolver: yupResolver(editUserSchema),
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		fetchRoles({ pagesize: -1 });
	}, []);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.USERS`), to: USER_PATHS.ROOT }, { label: t(`BREADCRUMBS.EDIT`) }]);
	}, [user]);

	useEffect(() => {
		if (!userId) {
			return;
		}

		fetchUser(userId);
	}, [userId]);

	const onSubmit = (values: CreateUserForm) => {
		createUser(values)
			.then((user) => navigate(generatePath(USER_PATHS.DETAIL, { userId: user.id })))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	return (
		<>
			<Header breadcrumbs={breadcrumbs} title={<Trans t={t} i18nKey="USERS.TITLES.CREATE" values={{ userName: user?.name }} />}></Header>
			<div className="u-margin-top">
				<Loading loading={userLoading || rolesLoading} text="Loading data...">
					<FormProvider {...formMethods}>
						<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
							{errors?.root?.message}
						</Alert>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="u-margin-bottom">
								<TextField name="name" label="Name" />
							</div>
							<div className="u-margin-bottom">
								<TextField name="email" label="Email" />
							</div>
							<div className="u-margin-bottom">
								<TextField name="password" label="Password" type={TextFieldTypes.PASSWORD} />
							</div>
							<div className="u-margin-bottom">
								<CheckboxField
									name="roles"
									label="Roles"
									fieldConfiguration={{ options: roles.map((role) => ({ label: role.name, value: role.id })) }}
								/>
							</div>
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{createUserLoading && <i className="las la-redo-alt la-spin"></i>} Create
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
