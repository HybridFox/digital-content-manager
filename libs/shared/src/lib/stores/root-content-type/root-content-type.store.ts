import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';
import { DEFAULT_PAGINATION_OPTIONS } from '../../const';
import { IContentTypesResponse } from '../content-type';

import { IRootContentTypeStoreState } from './root-content-type.types';

export const useRootContentTypeStore = create<IRootContentTypeStoreState>()(devtools(
	(set) => ({
		fetchRootContentTypes: async (searchParams) => {
			set(() => ({ rootContentTypesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/content-types`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<IContentTypesResponse>());

			if (error) {
				return set(() => ({ rootContentTypes: [], rootContentTypesLoading: false }))
			}
			
			set(() => ({ rootContentTypes: result._embedded.contentTypes, rootContentTypesPagination: result._page, rootContentTypesLoading: false }));
		},
		rootContentTypes: [],
		rootContentTypesLoading: false,
		
		enableContentType: async (contentTypeId, siteId) => {
			set(() => ({ enableContentTypeLoading: true }));
			const [_, error] = await wrapApi(kyInstance.post(`/admin-api/v1/content-types/${contentTypeId}/sites/${siteId}`).json<void>());

			if (error) {
				return set(() => ({ rootContentTypesLoading: false }))
			}
			
			set(() => ({ enableContentTypeLoading: false }));
		},
		enableContentTypeLoading: false,
		
		disableContentType: async (contentTypeId, siteId) => {
			set(() => ({ disableContentTypeLoading: true }));
			const [_, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/content-types/${contentTypeId}/sites/${siteId}`).json<void>());

			if (error) {
				return set(() => ({ rootContentTypesLoading: false }))
			}
			
			set(() => ({ disableContentTypeLoading: false }));
		},
		disableContentTypeLoading: false,
	}), { name: 'rootContentTypeStore' }
))
