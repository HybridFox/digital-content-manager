import { IAPIError, useAuthenticationMethodStore, useHeaderStore } from '@ibs/shared';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NumberField, SelectField, TextField, ToggleField } from '@ibs/forms';

import { AUTHENTICATION_METHOD_OPTIONS } from '../../authentication-methods.const';
import { AUTHENTICATION_METHOD_PATHS } from '../../authentication-methods.routes';

import { editAuthenticationMethodSchema } from './authentication-method-create.const';

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
		setBreadcrumbs([{ label: t(`BREADCRUMBS.STORAGE_REPOSITORIES`), to: AUTHENTICATION_METHOD_PATHS.ROOT }, { label: t(`BREADCRUMBS.CREATE`) }]);
	}, []);

	const onSubmit = (values: CreateAuthenticationMethodForm) => {
		if (!authenticationMethodId) {
			return;
		}

		createAuthenticationMethod({
			...values,
			configuration: {},
			active: false,
			weight: 0,
		}).catch((error: IAPIError) => {
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
					<>
						Create authentication method
					</>
				}
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
								<NumberField name="weight" label="Weight" />
							</div>
							<div className="u-margin-bottom">
								<ToggleField name="active" label="Active" />
							</div>
							<div className="u-margin-bottom">
								<SelectField name="kind" label="Kind" disabled fieldConfiguration={{ options: AUTHENTICATION_METHOD_OPTIONS }} />
							</div>
							<Button htmlType={HTMLButtonTypes.SUBMIT}>
								{createAuthenticationMethodLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
			</div>
		</>
	);
};
