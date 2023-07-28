import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { kyInstance, useAuthStore, wrapApi } from '@ibs/shared';

import { IContentItem, IContentStoreState, IContentResponse } from './content.types';

export const useContentStore = create<IContentStoreState>()(devtools(
	(set) => ({
		fetchContent: async () => {
			set(() => ({ contentLoading: true }));
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${selectedSiteId}/content`).json<IContentResponse>());

			if (error) {
				return set(() => ({ content: [], contentLoading: false }))
			}
			
			set(() => ({ content: result._embedded.content, contentLoading: false }));
		},
		content: [],
		contentLoading: false,

		fetchContentItem: async (contentId) => {
			set(() => ({ contentLoading: true }));
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${selectedSiteId}/content/${contentId}`).json<IContentItem>());

			if (error) {
				set(() => ({ content: undefined, contentLoading: false }));
				throw error;
			}
			
			set(() => ({ contentItem: result, contentLoading: false }));
		},
		contentItem: undefined,
		contentItemLoading: false,

		createContentItem: async (content) => {
			set(() => ({ createContentItemLoading: true }));
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${selectedSiteId}/content`, {
				json: {
					...content,
					fields: []
				},
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
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${selectedSiteId}/content/${contentId}`, {
				json: data,
			}).json<IContentItem>());

			if (error) {
				set(() => ({ updateContentItemLoading: false }));
				throw error;
			}
			
			set(() => ({ contentItem: result, updateContentLoading: false }));
			return result;
		},
		updateContentItemLoading: false,
	}), { name: 'contentStore' }
))
