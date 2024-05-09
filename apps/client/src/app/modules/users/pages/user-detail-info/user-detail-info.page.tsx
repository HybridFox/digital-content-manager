import { useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes } from '~components';
import { TextField, TextFieldTypes } from '~components';

import { useUserStore } from '../../stores/user';

import { editUserSchema } from './user-detail-info.const';

import { IAPIError } from '~shared';

interface EditUserForm {
	name: string;
	email: string;
	password: string | undefined | null;
}

export const UserDetailInfoPage = () => {
	const [user] = useUserStore((state) => [state.user]);
	const [updateUserLoading, updateUser] = useUserStore((state) => [state.updateUserLoading, state.updateUser]);
	const { userId } = useParams();
	const formMethods = useForm<EditUserForm>({
		resolver: yupResolver(editUserSchema),
		values: {
			name: '',
			email: '',
			...(user || {}),
			password: '',
		},
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	const onSubmit = (values: EditUserForm) => {
		if (!userId) {
			return;
		}

		updateUser(userId, {
			...values,
			roles: (user?.roles || []).map((role) => role.id),
		}).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	return (
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
				<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>{updateUserLoading && <i className="las la-redo-alt la-spin"></i>} Save</Button>
			</form>
		</FormProvider>
	);
};
