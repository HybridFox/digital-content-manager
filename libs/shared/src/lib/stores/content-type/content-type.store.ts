import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';
import { useAuthStore } from '../auth';

import { IContentType, IContentTypeStoreState, IContentTypesResponse } from './content-type.types';

export const useContentTypeStore = create<IContentTypeStoreState>()(devtools(
	(set) => ({
		fetchContentTypes: async () => {
			set(() => ({ contentTypesLoading: true }));
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${selectedSiteId}/content-types`).json<IContentTypesResponse>());

			if (error) {
				return set(() => ({ contentTypes: [], contentTypesLoading: false }))
			}
			
			set(() => ({ contentTypes: result._embedded.contentTypes, contentTypesLoading: false }));
		},
		contentTypes: [],
		contentTypesLoading: false,

		fetchContentType: async (contentTypeId) => {
			set(() => ({ contentTypeLoading: true }));
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${selectedSiteId}/content-types/${contentTypeId}`).json<IContentType>());

			if (error) {
				set(() => ({ contentType: undefined, contentTypeLoading: false }));
				throw error;
			}
			
			set(() => ({ contentType: result, contentTypeLoading: false }));
		},
		contentType: undefined,
		contentTypeLoading: false,

		createContentType: async (contentType) => {
			set(() => ({ createContentTypeLoading: true }));
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${selectedSiteId}/content-types`, {
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

		updateContentType: async (contentTypeId, data) => {
			set(() => ({ updateContentTypeLoading: true }));
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${selectedSiteId}/content-types/${contentTypeId}`, {
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
	}), { name: 'contentTypeStore' }
))
