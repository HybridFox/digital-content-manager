import { IAPIError, useAuthenticationMethodStore, useHeaderStore } from '@ibs/shared';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { Trans, useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldGroupHeader, NumberField, RenderFields, SelectField, TextField, ToggleField } from '@ibs/forms';

import { AUTHENTICATION_METHOD_FIELDS, AUTHENTICATION_METHOD_OPTIONS } from '../../authentication-methods.const';
import { AUTHENTICATION_METHOD_PATHS } from '../../authentication-methods.routes';

import { editAuthenticationMethodSchema } from './authentication-method-detail.const';

interface EditAuthenticationMethodForm {
	name: string;
	configuration: any;
	active: boolean;
	weight: number;
}

export const AuthenticationMethodDetailPage = () => {
	const { t } = useTranslation();

	const [authenticationMethod, authenticationMethodLoading, fetchAuthenticationMethod] = useAuthenticationMethodStore((state) => [
		state.authenticationMethod,
		state.authenticationMethodLoading,
		state.fetchAuthenticationMethod,
	]);
	const [updateAuthenticationMethodLoading, updateAuthenticationMethod] = useAuthenticationMethodStore((state) => [
		state.updateAuthenticationMethodLoading,
		state.updateAuthenticationMethod,
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { authenticationMethodId } = useParams();
	const formMethods = useForm<EditAuthenticationMethodForm>({
		resolver: yupResolver(editAuthenticationMethodSchema),
		values: authenticationMethod,
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.AUTHENTICATION_METHODS`), to: AUTHENTICATION_METHOD_PATHS.ROOT }, { label: t(`BREADCRUMBS.EDIT`) }]);
	}, [authenticationMethod]);

	useEffect(() => {
		if (!authenticationMethodId) {
			return;
		}

		fetchAuthenticationMethod(authenticationMethodId);
	}, [authenticationMethodId]);

	const onSubmit = (values: EditAuthenticationMethodForm) => {
		if (!authenticationMethodId) {
			return;
		}

		updateAuthenticationMethod(authenticationMethodId, values).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={<Trans t={t} i18nKey="AUTHENTICATION_METHODS.TITLES.EDIT" values={{ authenticationMethodName: authenticationMethod?.name || '...' }} />}
			></Header>
			<div className="u-margin-top">
				<Loading loading={authenticationMethodLoading} text="Loading data...">
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
							{authenticationMethod?.kind && (
								<>
									<FieldGroupHeader label='Configuration' />
									<RenderFields fields={AUTHENTICATION_METHOD_FIELDS[authenticationMethod?.kind] || []} fieldPrefix="configuration."></RenderFields>
								</>
							)}
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateAuthenticationMethodLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
