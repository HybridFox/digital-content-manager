import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';
import { DEFAULT_PAGINATION_OPTIONS } from '../../const';

import { IContentType, IContentTypeStoreState, IContentTypesResponse } from './content-type.types';

export const useContentTypeStore = create<IContentTypeStoreState>()(devtools(
	(set) => ({
		fetchContentTypes: async (siteId, searchParams) => {
			set(() => ({ contentTypesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content-types`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<IContentTypesResponse>());

			if (error) {
				return set(() => ({ contentTypes: [], contentTypesLoading: false }))
			}
			
			set(() => ({ contentTypes: result._embedded.contentTypes, contentTypesPagination: result._page, contentTypesLoading: false }));
		},
		contentTypes: [],
		contentTypesLoading: false,

		fetchContentType: async (siteId, contentTypeId) => {
			set(() => ({ contentTypeLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}`).json<IContentType>());

			if (error) {
				set(() => ({ contentType: undefined, contentTypeLoading: false }));
				throw error;
			}
			
			set(() => ({ contentType: result, contentTypeLoading: false }));
			return result;
		},
		contentType: undefined,
		contentTypeLoading: false,

		createContentType: async (siteId, contentType) => {
			set(() => ({ createContentTypeLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/sites/${siteId}/content-types`, {
				json: {
					...contentType,
					fields: []
				},
			}).json<IContentType>());
			set(() => ({ createContentTypeLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createContentTypeLoading: false,

		updateContentType: async (siteId, contentTypeId, data) => {
			set(() => ({ updateContentTypeLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}`, {
				json: data,
			}).json<IContentType>());

			if (error) {
				set(() => ({ updateContentTypeLoading: false }));
				throw error;
			}
			
			set(() => ({ contentType: result, updateContentTypeLoading: false }));
			return result;
		},
		updateContentTypeLoading: false,

		removeContentType: async (siteId, contentTypeId) => {
			set(() => ({ removeContentTypeLoading: true }));
			const [, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}`).json<void>());

			if (error) {
				set(() => ({ removeContentTypeLoading: false }));
				throw error;
			}
			
			set(() => ({ removeContentTypeLoading: false }));
			return;
		},
		removeContentTypeLoading: false,
	}), { name: 'contentTypeStore' }
))
