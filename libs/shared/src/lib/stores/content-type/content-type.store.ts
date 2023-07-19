import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';
import { useAuthStore } from '../auth';

import { IContentType, IContentTypesResponse } from './content-type.types';

interface IContentTypeStoreState {
	contentTypes: IContentType[];
	fetchContentTypes: () => Promise<void>;
}

export const useContentTypeStore = create<IContentTypeStoreState>()(devtools(
	(set) => ({
		contentTypes: [],
		fetchContentTypes: async () => {
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${selectedSiteId}/content-types`).json<IContentTypesResponse>());
			if (error) {
				return set(() => ({ contentTypes: [] }))
			}
			
			set(() => ({ contentTypes: result._embedded.contentTypes }));
		}
	}), { name: 'contentTypeStore' }
))
