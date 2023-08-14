import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes } from "@ibs/components"
import cx from 'classnames/bind';
import classNames from "classnames";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate } from "react-router-dom";
import { IAPIError, useAuthStore } from "@ibs/shared";
import { TextField, TextFieldTypes } from "@ibs/forms";
import { useTranslation } from "react-i18next";

import { useSetupStore } from "../../stores/setup";

import styles from './setup.module.scss';
import { setupSchema } from "./setup.const";
const cxBind = cx.bind(styles);

interface ISetupForm {
	email: string;
	name: string;
	password: string;
}

export const SetupPage = () => {
	const setupStore = useSetupStore();
	const navigate = useNavigate();
	const formMethods = useForm<ISetupForm>({ resolver: yupResolver(setupSchema) });
	const { handleSubmit, setError, formState: { errors } } = formMethods;
	const { t } = useTranslation();

	const onSubmit = (values: ISetupForm) => {
		setupStore.setup(values)
			.then(() => navigate('/app/sites'))
			.catch((error: IAPIError) => {
				setError('root', {
					message: t(`API_MESSAGES.${error.code}`)
				})
			});
	}

	return (
		<div className={cxBind('p-setup')}>
			<div className={cxBind('p-setup__content')}>
				<div className={cxBind('p-setup__form')}>
					<div className={classNames("u-margin-bottom-lg", cxBind('p-setup__logo'))}>
						<i className="las la-sms"></i> Inhoud Beheer Systeem
					</div>
					<h1 className="u-margin-bottom">Initial Account Setup</h1>
					<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>{errors?.root?.message}</Alert>
					<FormProvider {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="u-margin-bottom">
								<TextField name="email" label="Email" type={TextFieldTypes.EMAIL} fieldOptions={{ required: true }} />
							</div>
							<div className="u-margin-bottom">
								<TextField name="name" label="Name" fieldOptions={{ required: true }} />
							</div>
							<div className="u-margin-bottom">
								<TextField name="password" label="Password" type={TextFieldTypes.PASSWORD} fieldOptions={{ required: true }} />
							</div>
							<div>
								<Button className="u-margin-right-sm" htmlType={HTMLButtonTypes.SUBMIT}>Setup</Button>
							</div>
						</form>
					</FormProvider>
				</div>
			</div>
			<div className={cxBind('p-setup__aside')} style={{
				backgroundImage: `url(https://images.unsplash.com/photo-1563923683738-4ad77b43411c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`
			}}></div>
		</div>
	)
}
