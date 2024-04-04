import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '~components';

import { WEBHOOKS_PATHS } from '../../webhooks.routes';
import { WEBHOOK_OPTIONS } from '../../webhooks.const';

import { editWebhookSchema } from './webhook-detail.const';

import { SelectField, TextField, ToggleField } from '~forms';
import { IAPIError, useHeaderStore, useWebhookStore, WebhookEvents } from '~shared';

interface EditWebhookForm {
	url: string;
	event: WebhookEvents;
	request_configuration: Record<string, string> | undefined;
	active: boolean;
}

export const WebhookDetailPage = () => {
	const { t } = useTranslation();

	const [webhook, webhookLoading, fetchWebhook] = useWebhookStore((state) => [
		state.webhook,
		state.webhookLoading,
		state.fetchWebhook,
	]);
	const [updateWebhookLoading, updateWebhook] = useWebhookStore((state) => [
		state.updateWebhookLoading,
		state.updateWebhook,
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { webhookId, siteId } = useParams();
	const formMethods = useForm<EditWebhookForm>({
		resolver: yupResolver(editWebhookSchema),
		values: webhook,
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.STORAGE_REPOSITORIES`), to: WEBHOOKS_PATHS.ROOT }, { label: t(`BREADCRUMBS.EDIT`) }]);
	}, [webhook]);

	useEffect(() => {
		if (!webhookId) {
			return;
		}

		fetchWebhook(siteId!, webhookId);
	}, [webhookId]);

	const onSubmit = (values: EditWebhookForm) => {
		if (!webhookId) {
			return;
		}

		updateWebhook(siteId!, webhookId, values).catch((error: IAPIError) => {
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
						Editing webhook
					</>
				}
			></Header>
			<div className="u-margin-top">
				<Loading loading={webhookLoading} text="Loading data...">
					<FormProvider {...formMethods}>
						<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
							{errors?.root?.message}
						</Alert>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="u-margin-bottom">
								<TextField name="url" label="URL" />
							</div>
							<div className="u-margin-bottom">
								<SelectField name="event" label="Event" fieldConfiguration={{ options: WEBHOOK_OPTIONS }} />
							</div>
							<div className="u-margin-bottom">
								<ToggleField name="active" label="Active" />
							</div>
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateWebhookLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
