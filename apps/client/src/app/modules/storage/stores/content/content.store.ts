import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { kyInstance, useAuthStore, wrapApi } from '@ibs/shared';

import { IContentItem, IContentStoreState, IContentResponse } from './content.types';

export const useContentStore = create<IContentStoreState>()(devtools(
	(set) => ({
		fetchContent: async (params) => {
			set(() => ({ contentLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/content`, {
				searchParams: {
					...(params || {})
				}
			}).json<IContentResponse>());

			if (error) {
				return set(() => ({ content: [], contentLoading: false }))
			}
			
			set(() => ({ content: result._embedded.content, contentLoading: false }));
		},
		content: [],
		contentLoading: false,

		fetchContentItem: async (contentId) => {
			set(() => ({ contentLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/content/${contentId}`).json<IContentItem>());

			if (error) {
				set(() => ({ content: undefined, contentLoading: false }));
				throw error;
			}
			
			set(() => ({ contentItem: result, contentLoading: false }));
			return result;
		},
		contentItem: undefined,
		contentItemLoading: false,

		createContentItem: async (content) => {
			set(() => ({ createContentItemLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/content`, {
				json: content,
			}).json<IContentItem>());
			set(() => ({ createContentItemLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createContentItemLoading: false,

		updateContentItem: async (contentId, data) => {
			set(() => ({ updateContentItemLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${activeSite?.id}/content/${contentId}`, {
				json: data,
			}).json<IContentItem>());

			if (error) {
				set(() => ({ updateContentItemLoading: false }));
				throw error;
			}
			
			set(() => ({ contentItem: result, updateContentItemLoading: false }));
			return result;
		},
		updateContentItemLoading: false,
	}), { name: 'contentStore' }
))
