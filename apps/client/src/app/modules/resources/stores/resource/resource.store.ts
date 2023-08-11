import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { kyInstance, useAuthStore, wrapApi } from '@ibs/shared';

import { IResourceStoreState, IResourcesResponse } from './resource.types';

const fetchResources = (set: any) => async (contentRepositoryId: any, params?: any) => {
	set(() => ({ resourcesLoading: true }));
	const { activeSite } = useAuthStore.getState();
	const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/storage-repositories/${contentRepositoryId}/directories`, {
		searchParams: {
			...(params || {})
		}
	}).json<IResourcesResponse>());

	if (error) {
		return set(() => ({ resources: [], resourcesLoading: false }))
	}
	
	set(() => ({ resources: result._embedded.resources, resourcesLoading: false }));
};

export const useResourceStore = create<IResourceStoreState>()(devtools(
	(set) => ({
		fetchResources: fetchResources(set),
		resources: [],
		resourcesLoading: false,

		createDirectory: async (contentRepositoryId, path, name) => {
			set(() => ({ createDirectoryLoading: true }));
			const { activeSite } = useAuthStore.getState();
			await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/storage-repositories/${contentRepositoryId}/directories`, {
				json: {
					name,
				},
				searchParams: {
					path
				}
			}).json<void>());
			
			set(() => ({ createDirectoryLoading: false }));
			fetchResources(set)(contentRepositoryId, { path });
		},
		createDirectoryLoading: false,

		removeDirectory: async (contentRepositoryId, path, name) => {
			set(() => ({ removeDirectoryLoading: true }));
			const { activeSite } = useAuthStore.getState();
			await wrapApi(kyInstance.delete(`/api/v1/sites/${activeSite?.id}/storage-repositories/${contentRepositoryId}/directories`, {
				searchParams: {
					path: `${path}/${name}`
				}
			}).json<void>());
			
			set(() => ({ removeDirectoryLoading: false }));
			fetchResources(set)(contentRepositoryId, { path });
		},
		removeDirectoryLoading: false,

		uploadFile: async (contentRepositoryId, path, file) => {
			set(() => ({ uploadFileLoading: true }));
			const formData = new FormData();
			formData.append('file', file);

			const { activeSite } = useAuthStore.getState();
			await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/storage-repositories/${contentRepositoryId}/files`, {
				body: formData,
				searchParams: {
					path
				}
			}).json<void>());
			
			set(() => ({ uploadFileLoading: false }));
			fetchResources(set)(contentRepositoryId, { path });
		},
		uploadFileLoading: false,
	}), { name: 'resourcesStore' }
))
