import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Loading } from "@ibs/components"
import cx from 'classnames/bind';
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate } from "react-router-dom";
import { IAPIError, IAuthenticationMethod, useAuthStore, useAuthenticationMethodStore } from "@ibs/shared";
import { TextField, TextFieldTypes } from "@ibs/forms";
import { useTranslation } from "react-i18next";
import { FormEvent, useEffect } from "react";

import styles from './login.module.scss';
import { loginSchema } from "./login.const";
const cxBind = cx.bind(styles);

interface ILoginForm {
	email: string;
	password: string;
}

export const LoginPage = () => {
	const authStore = useAuthStore();
	const navigate = useNavigate();
	const formMethods = useForm<ILoginForm>({ resolver: yupResolver(loginSchema) });
	const { handleSubmit, setError, formState: { errors } } = formMethods;
	const { t } = useTranslation();
	const [authenticationMethods, authenticationMethodsLoading, fetchAuthenticationMethods] = useAuthenticationMethodStore((state) => [
		state.authenticationMethods,
		state.authenticationMethodLoading,
		state.fetchAuthenticationMethods
	]);

	useEffect(() => {
		fetchAuthenticationMethods({ pagesize: -1 });
	}, [])

	const renderAuthButton = (authenticationMethod: IAuthenticationMethod) => {
		const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			authStore.login(authenticationMethod.id)
				.then((e) => window.location.replace(e.redirect))
				.catch((error: IAPIError) => {
					setError('root', {
						message: t(`API_MESSAGES.${error.code}`)
					})
				});
		}
		
		return (
			<div className={cxBind('p-login__button')}>
				<form onSubmit={handleSubmit}>
					<Button htmlType={HTMLButtonTypes.SUBMIT}>Login with {authenticationMethod.name}</Button>
				</form>
			</div>
		)
	}

	const renderLocalAuthForm = (authenticationMethod: IAuthenticationMethod) => {
		const onSubmit = ({ email, password }: ILoginForm) => {
			authStore.loginLocal(authenticationMethod.id, email, password)
				.then(() => navigate('/'))
				.catch((error: IAPIError) => {
					setError('root', {
						message: t(`API_MESSAGES.${error.code}`)
					})
				});
		}

		return (
			<div className={cxBind('p-login__form')}>
				<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>{errors?.root?.message}</Alert>
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="u-margin-bottom">
							<TextField name="email" label="Email" type={TextFieldTypes.EMAIL} fieldOptions={{ required: true }} />
						</div>
						<div className="u-margin-bottom">
							<TextField name="password" label="Password" type={TextFieldTypes.PASSWORD} fieldOptions={{ required: true }} />
						</div>
						<div>
							<Button className="u-margin-right-sm" type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>Login</Button>
							<Button type={ButtonTypes.OUTLINE}>Forgot password</Button>
						</div>
					</form>
				</FormProvider>
			</div>
		)
	}

	return (
		<div className={cxBind('p-login')}>
			<div className={cxBind('p-login__content')}>
				<div className={cxBind('p-login__logo')}>
					<img src="/assets/img/logo.svg" alt="Logo" />
				</div>
				<Loading loading={authenticationMethodsLoading}>
					{(authenticationMethods || []).map((method) => {
						if (method.kind === 'LOCAL') {
							return renderLocalAuthForm(method);
						}

						return renderAuthButton(method);
					})}
				</Loading>
			</div>
			<div className={cxBind('p-login__aside')} style={{
				backgroundImage: `url(https://images.unsplash.com/photo-1563923683738-4ad77b43411c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`
			}}></div>
		</div>
	)
}
