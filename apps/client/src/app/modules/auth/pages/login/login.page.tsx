import cx from 'classnames/bind';
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormEvent, useEffect } from "react";

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Loading } from "~components"
import { TextField, TextFieldTypes } from "~components";

import styles from './login.module.scss';
import { loginSchema } from "./login.const";

import { IAPIError, IAuthenticationMethod, useAuthStore, useAuthenticationMethodStore, useThemeStore } from "~shared";
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
	const [theme] = useThemeStore((state) => [state.theme]);
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
			<div className={cxBind('p-login__button')} key={authenticationMethod.id}>
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
			<div className={cxBind('p-login__form')} key={authenticationMethod.id}>
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
					<img src={`/assets/img/logo-alternative-${theme}.svg`} alt="Logo" />
				</div>
				<Loading loading={authenticationMethodsLoading}>
					{(authenticationMethods || []).sort((a, b) => b.weight - a.weight).map((method) => {
						if (method.kind === 'LOCAL') {
							return renderLocalAuthForm(method);
						}

						return renderAuthButton(method);
					})}
				</Loading>
			</div>
			<div className={cxBind('p-login__aside')}>
				<div
					className={cxBind('p-login__aside__lazy')}
					style={{
						backgroundImage: `url(https://images.unsplash.com/photo-1579033014049-f33d9b14d37e?auto=format&fit=crop&w=300&q=10)`,
					}}
				></div>
				<div
					className={cxBind('p-login__aside__background')}
					style={{
						backgroundImage: `url(https://images.unsplash.com/photo-1579033014049-f33d9b14d37e?auto=format&fit=crop&w=1920&q=100)`,
					}}
				></div>
			</div>
		</div>
	)
}
