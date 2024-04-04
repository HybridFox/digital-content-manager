import { IAPIHALResponse, IAPIPagination, IPageParameters } from "../../types";

export enum WebhookEvents {
	CONTENT_PUBLISH = 'CONTENT_PUBLISH'
}

export interface IWebhook {
	id: string;
	url: string;
	event: WebhookEvents;
	request_configuration: any;
	active: boolean;
}

export type IWebhooksResponse = IAPIHALResponse<'webhooks', IWebhook>;

export interface IWebhookStoreState {
	fetchWebhooks: (siteId: string, params?: IPageParameters) => Promise<IWebhook[]>;
	webhooks: IWebhook[];
	webhooksPagination?: IAPIPagination,
	webhooksLoading: boolean;

	fetchWebhook: (siteId: string, webhookId: string) => Promise<IWebhook>;
	webhook?: IWebhook,
	webhookLoading: boolean;

	createWebhook: (siteId: string, webhook: IWebhookCreateDTO) => Promise<IWebhook>;
	createWebhookLoading: boolean;

	updateWebhook: (siteId: string, webhookId: string, values: IWebhookUpdateDTO) => Promise<IWebhook>;
	updateWebhookLoading: boolean;

	removeWebhook: (siteId: string, webhookId: string) => Promise<void>;
	removeWebhookLoading: boolean;
}

export interface IWebhookCreateDTO {
	event: string;
	url: string;
	request_configuration?: Record<string, string>;
	active: boolean;
}

export interface IWebhookUpdateDTO {
	event: string;
	url: string;
	request_configuration?: Record<string, string>;
	active: boolean;
}
