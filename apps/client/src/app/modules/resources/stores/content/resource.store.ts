import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { kyInstance, useAuthStore, wrapApi } from '@ibs/shared';

import { IResource, IResourceStoreState, IResourcesResponse } from './resource.types';

export const useResourceStore = create<IResourceStoreState>()(devtools(
	(set) => ({
		fetchResources: async (params) => {
			set(() => ({ resourcesLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/content`, {
				searchParams: {
					...(params || {})
				}
			}).json<IResourcesResponse>());

			if (error) {
				return set(() => ({ resources: [], resourcesLoading: false }))
			}
			
			set(() => ({ resources: result._embedded.resources, resourcesLoading: false }));
		},
		resources: [],
		resourcesLoading: false,

		fetchResource: async (resourceId) => {
			set(() => ({ resourceLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/resource/${resourceId}`).json<IResource>());

			if (error) {
				set(() => ({ resource: undefined, resourceLoading: false }));
				throw error;
			}
			
			set(() => ({ resource: result, contentLoading: false }));
			return result;
		},
		resource: undefined,
		resourceLoading: false,

		createResource: async (resource) => {
			set(() => ({ createResourceLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/resources`, {
				json: resource,
			}).json<IResource>());
			set(() => ({ createResourceLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createResourceLoading: false,

		updateResource: async (contentId, data) => {
			set(() => ({ updateResourceLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${activeSite?.id}/content/${contentId}`, {
				json: data,
			}).json<IResource>());

			if (error) {
				set(() => ({ updateResourceLoading: false }));
				throw error;
			}
			
			set(() => ({ resource: result, updateResourceLoading: false }));
			return result;
		},
		updateResourceLoading: false,
	}), { name: 'contentStore' }
))
