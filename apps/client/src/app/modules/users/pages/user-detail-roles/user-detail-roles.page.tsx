import { IAPIError, useRoleStore } from '@ibs/shared';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxField } from '@ibs/forms';

import { useUserStore } from '../../stores/user';

import { editUserSchema } from './user-detail-roles.const';

interface EditUserForm {
	roles: string[];
}

export const UserDetailRolesPage = () => {
	const [user] = useUserStore((state) => [
		state.user,
		state.userLoading,
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
	const { userId } = useParams();
	const formMethods = useForm<EditUserForm>({
		resolver: yupResolver(editUserSchema),
		values: {
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

	const onSubmit = (values: EditUserForm) => {
		if (!userId) {
			return;
		}

		updateUser(userId, {
			...user,
			...values,
		}).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	return (
		<Loading loading={rolesLoading} text="Loading data...">
			<FormProvider {...formMethods}>
				<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
					{errors?.root?.message}
				</Alert>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="u-margin-bottom">
						<CheckboxField name="roles" label="Roles" fieldConfiguration={{ options: roles.map((role) => ({ label: role.name, value: role.id })) }} />
					</div>
					<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
						{updateUserLoading && <i className="las la-redo-alt la-spin"></i>} Save
					</Button>
				</form>
			</FormProvider>
		</Loading>
	);
};
