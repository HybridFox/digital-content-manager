import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header } from '~components';
import { SelectField, TextField } from '~components';

import { AUTHENTICATION_METHOD_OPTIONS } from '../../authentication-methods.const';
import { AUTHENTICATION_METHOD_PATHS } from '../../authentication-methods.routes';

import { editAuthenticationMethodSchema } from './authentication-method-create.const';

import { IAPIError, useAuthenticationMethodStore, useHeaderStore } from '~shared';

interface CreateAuthenticationMethodForm {
	name: string;
	kind: string;
}

export const AuthenticationMethodCreatePage = () => {
	const { t } = useTranslation();
	const [createAuthenticationMethodLoading, createAuthenticationMethod] = useAuthenticationMethodStore((state) => [
		state.createAuthenticationMethodLoading,
		state.createAuthenticationMethod,
	]);
	const navigate = useNavigate();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { authenticationMethodId } = useParams();
	const formMethods = useForm<CreateAuthenticationMethodForm>({
		resolver: yupResolver(editAuthenticationMethodSchema),
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.AUTHENTICATION_METHODS`), to: AUTHENTICATION_METHOD_PATHS.ROOT }, { label: t(`BREADCRUMBS.CREATE`) }]);
	}, []);

	const onSubmit = (values: CreateAuthenticationMethodForm) => {
		createAuthenticationMethod({
			...values,
			configuration: {},
			active: false,
			weight: 0,
		})
		.then((authMethod) => navigate(generatePath(AUTHENTICATION_METHOD_PATHS.DETAIL, { authenticationMethodId: authMethod.id })))
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
				title={t('AUTHENTICATION_METHODS.TITLES.CREATE')}
			></Header>
			<div className="u-margin-top">
				<FormProvider {...formMethods}>
					<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
						{errors?.root?.message}
					</Alert>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="u-margin-bottom">
							<TextField name="name" label="Name" />
						</div>
						<div className="u-margin-bottom">
							<SelectField name="kind" label="Kind" fieldConfiguration={{ options: AUTHENTICATION_METHOD_OPTIONS }} />
						</div>
						<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
							{createAuthenticationMethodLoading && <i className="las la-redo-alt la-spin"></i>} Save
						</Button>
					</form>
				</FormProvider>
			</div>
		</>
	);
};
