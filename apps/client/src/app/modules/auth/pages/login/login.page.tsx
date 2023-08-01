import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes } from "@ibs/components"
import cx from 'classnames/bind';
import classNames from "classnames";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate } from "react-router-dom";
import { IAPIError, useAuthStore } from "@ibs/shared";
import { TextField, TextFieldTypes } from "@ibs/forms";
import { useTranslation } from "react-i18next";

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

	const onSubmit = ({ email, password }: ILoginForm) => {
		authStore.login(email, password)
			.then(() => navigate('/app/dashboard'))
			.catch((error: IAPIError) => {
				setError('root', {
					message: t(`API_MESSAGES.${error.code}`)
				})
			});
	}

	return (
		<div className={cxBind('p-login')}>
			<div className={cxBind('p-login__content')}>
				<div className={cxBind('p-login__form')}>
					<div className={classNames("u-margin-bottom-lg", cxBind('p-login__logo'))}>
						<i className="las la-sms"></i> Inhoud Beheer Systeem
					</div>
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
								<Button className="u-margin-right-sm" htmlType={HTMLButtonTypes.SUBMIT}>Login</Button>
								<Button type={ButtonTypes.OUTLINE}>Forgot password</Button>
							</div>
						</form>
					</FormProvider>
				</div>
			</div>
			<div className={cxBind('p-login__aside')} style={{
				backgroundImage: `url(https://images.unsplash.com/photo-1563923683738-4ad77b43411c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`
			}}></div>
		</div>
	)
}
