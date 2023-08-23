import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, parseQueryParams, wrapApi } from '../../services';

import { IContentItem, IContentStoreState, IContentResponse } from './content.types';

export const useContentStore = create<IContentStoreState>()(devtools(
	(set) => ({
		fetchContent: async (siteId, params) => {
			set(() => ({ contentLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content`, {
				searchParams: parseQueryParams(params as any)
			}).json<IContentResponse>());

			if (error) {
				return set(() => ({ content: [], contentLoading: false }))
			}
			
			set(() => ({ content: result._embedded.content, contentPagination: result._page, contentLoading: false }));
		},
		content: [],
		contentPagination: undefined,
		contentLoading: false,

		fetchContentItem: async (siteId, contentId) => {
			set(() => ({ contentLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content/${contentId}`).json<IContentItem>());

			if (error) {
				set(() => ({ content: undefined, contentLoading: false }));
				throw error;
			}
			
			set(() => ({ contentItem: result, contentLoading: false }));
			return result;
		},
		contentItem: undefined,
		contentItemLoading: false,

		createContentItem: async (siteId, content) => {
			set(() => ({ createContentItemLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/sites/${siteId}/content`, {
				json: content,
			}).json<IContentItem>());
			set(() => ({ createContentItemLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createContentItemLoading: false,

		updateContentItem: async (siteId, contentId, data) => {
			set(() => ({ updateContentItemLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/sites/${siteId}/content/${contentId}`, {
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

		removeContentItem: async (siteId, contentId) => {
			set(() => ({ removeContentItemLoading: true }));
			const [_, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/sites/${siteId}/content/${contentId}`).json<IContentItem>());

			if (error) {
				set(() => ({ removeContentItemLoading: false }));
				throw error;
			}
			
			set(() => ({ removeContentItemLoading: false }));
		},
		removeContentItemLoading: false,

		fetchDefaultValues: async (siteId, translationId) => {
			set(() => ({ defaultValuesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content/${translationId}/default-values`).json<IContentItem>());

			if (error) {
				set(() => ({ defaultValues: undefined, defaultValuesLoading: false }));
				throw error;
			}
			
			set(() => ({ defaultValues: result, defaultValuesLoading: false }));
			return result;
		},
		defaultValues: undefined,
		defaultValuesLoading: false,
	}), { name: 'contentStore' }
))
