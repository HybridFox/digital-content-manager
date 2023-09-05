import { IAPIError, useAuthenticationMethodStore } from '@ibs/shared';
import { useParams } from 'react-router-dom';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RenderFields } from '@ibs/components';

import { AUTHENTICATION_METHOD_FIELDS } from '../../authentication-methods.const';

import { editAuthenticationMethodSchema } from './authentication-method-configuration.const';

interface EditAuthenticationMethodForm {
	configuration: Record<string, string> | undefined;
}

export const AuthenticationMethodConfigurationPage = () => {
	const [authenticationMethod] = useAuthenticationMethodStore((state) => [
		state.authenticationMethod,
	]);
	const [updateAuthenticationMethodLoading, updateAuthenticationMethod] = useAuthenticationMethodStore((state) => [
		state.updateAuthenticationMethodLoading,
		state.updateAuthenticationMethod,
	]);
	const { authenticationMethodId } = useParams();
	const formMethods = useForm<EditAuthenticationMethodForm>({
		resolver: yupResolver(editAuthenticationMethodSchema),
		values: {
			configuration: {},
			...authenticationMethod,
		},
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	const onSubmit = (values: EditAuthenticationMethodForm) => {
		if (!authenticationMethodId) {
			return;
		}

		updateAuthenticationMethod(authenticationMethodId, {
			...authenticationMethod!,
			...values
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
				{authenticationMethod?.kind && (
					<RenderFields siteId='' fields={AUTHENTICATION_METHOD_FIELDS[authenticationMethod?.kind] || []} fieldPrefix="configuration."></RenderFields>
				)}
				<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
					{updateAuthenticationMethodLoading && <i className="las la-redo-alt la-spin"></i>} Save
				</Button>
			</form>
		</FormProvider>
	);
};
