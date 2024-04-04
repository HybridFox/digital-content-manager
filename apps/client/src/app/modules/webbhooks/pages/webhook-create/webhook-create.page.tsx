import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header } from '~components';

import { WEBHOOKS_PATHS } from '../../webhooks.routes';
import { WEBHOOK_OPTIONS } from '../../webhooks.const';

import { createWebhookSchema } from './webhook-create.const';

import { SelectField, TextField, ToggleField } from '~forms';
import {
	IAPIError,
	useHeaderStore,
	useWebhookStore,
	WebhookEvents,
} from '~shared';

interface CreateWebhookForm {
	url: string;
	event: WebhookEvents;
	request_configuration: Record<string, string> | undefined;
	active: boolean;
}

export const WebhookCreatePage = () => {
	const [createWebhook, createWebhookLoading] = useWebhookStore((state) => [
		state.createWebhook,
		state.createWebhookLoading,
	]);
	const navigate = useNavigate();
	const { siteId } = useParams();
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const formMethods = useForm<CreateWebhookForm>({
		resolver: yupResolver(createWebhookSchema)
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.STORAGE_REPOSITORIES`), to: WEBHOOKS_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`) },
		]);
	}, []);

	const onSubmit = (values: CreateWebhookForm) => {
		createWebhook(siteId!, values)
			.then((webhook) => navigate(generatePath(WEBHOOKS_PATHS.DETAIL, { siteId: siteId!, webhookId: webhook.id })))
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
				title={
					<>
						Create Webhook
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
							<TextField name="url" label="Url" />
						</div>
						<div className="u-margin-bottom">
							<SelectField name="event" label="Event" fieldConfiguration={{ options: WEBHOOK_OPTIONS }} />
						</div>
						<div className="u-margin-bottom">
							<ToggleField name="active" label="Active" />
						</div>
						<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
							{createWebhookLoading && <i className="las la-redo-alt la-spin"></i>} Save
						</Button>
					</form>
				</FormProvider>
			</div>
		</>
	);
};
