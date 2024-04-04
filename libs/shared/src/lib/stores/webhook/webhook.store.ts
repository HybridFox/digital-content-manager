import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services';

import { IWebhook, IWebhookStoreState, IWebhooksResponse } from './webhook.types';

export const useWebhookStore = create<IWebhookStoreState>()(devtools(
	(set) => ({
		fetchWebhooks: async (siteId, params) => {
			set(() => ({ webhooksLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/webhooks`, {
				searchParams: {
					...(params || {})
				}
			}).json<IWebhooksResponse>());

			if (error) {
				set(() => ({ webhooks: [], webhooksLoading: false }));
				return []
			}
			
			set(() => ({ webhooks: result._embedded.webhooks, webhooksPagination: result._page, webhooksLoading: false }));
			return result._embedded.webhooks;
		},
		webhooks: [],
		webhooksLoading: false,

		fetchWebhook: async (siteId, webhookId) => {
			set(() => ({ webhookLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/webhooks/${webhookId}`).json<IWebhook>());

			if (error) {
				set(() => ({ webhook: undefined, webhookLoading: false }));
				throw error;
			}
			
			set(() => ({ webhook: result, webhookLoading: false }));
			return result;
		},
		webhook: undefined,
		webhookLoading: false,

		createWebhook: async (siteId, webhook) => {
			set(() => ({ createWebhookLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/sites/${siteId}/webhooks`, {
				json: webhook,
			}).json<IWebhook>());
			set(() => ({ createWebhookLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createWebhookLoading: false,

		updateWebhook: async (siteId, webhookId, data) => {
			set(() => ({ updateWebhookLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/sites/${siteId}/webhooks/${webhookId}`, {
				json: data,
			}).json<IWebhook>());

			if (error) {
				set(() => ({ updateWebhookLoading: false }));
				throw error;
			}
			
			set(() => ({ webhook: result, updateWebhookLoading: false }));
			return result;
		},
		updateWebhookLoading: false,

		removeWebhook: async (siteId, webhookId) => {
			set(() => ({ removeWebhookLoading: true }));
			const [_, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/sites/${siteId}/webhooks/${webhookId}`).json<void>());

			if (error) {
				set(() => ({ removeWebhookLoading: false }));
				throw error;
			}
			
			set(({ webhooks }) => ({ removeWebhookLoading: false, webhooks: webhooks.filter((webhook) => webhook.id !== webhookId) }));
		},
		removeWebhookLoading: false,
	}), { name: 'webhookStore' }
)) 
