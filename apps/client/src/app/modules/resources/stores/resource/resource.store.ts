import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { kyInstance, useAuthStore, wrapApi } from '@ibs/shared';

import { IResourceStoreState, IResourcesResponse } from './resource.types';

const fetchResources = (set: any) => async (siteId: string, contentRepositoryId: any, params?: any) => {
	set(() => ({ resourcesLoading: true }));
	const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${siteId}/storage-repositories/${contentRepositoryId}/directories`, {
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

		createDirectory: async (siteId, contentRepositoryId, path, name) => {
			set(() => ({ createDirectoryLoading: true }));
			await wrapApi(kyInstance.post(`/api/v1/sites/${siteId}/storage-repositories/${contentRepositoryId}/directories`, {
				json: {
					name,
				},
				searchParams: {
					path
				}
			}).json<void>());
			
			set(() => ({ createDirectoryLoading: false }));
			fetchResources(set)(siteId, contentRepositoryId, { path });
		},
		createDirectoryLoading: false,

		removeDirectory: async (siteId, contentRepositoryId, path, name) => {
			set(() => ({ removeDirectoryLoading: true }));
			await wrapApi(kyInstance.delete(`/api/v1/sites/${siteId}/storage-repositories/${contentRepositoryId}/directories`, {
				searchParams: {
					path: `${path}/${name}`
				}
			}).json<void>());
			
			set(() => ({ removeDirectoryLoading: false }));
			fetchResources(set)(siteId, contentRepositoryId, { path });
		},
		removeDirectoryLoading: false,

		uploadFile: async (siteId, contentRepositoryId, path, file) => {
			set(() => ({ uploadFileLoading: true }));
			const formData = new FormData();
			formData.append('file', file);

			await wrapApi(kyInstance.post(`/api/v1/sites/${siteId}/storage-repositories/${contentRepositoryId}/files`, {
				body: formData,
				searchParams: {
					path
				}
			}).json<void>());
			
			set(() => ({ uploadFileLoading: false }));
			fetchResources(set)(siteId, contentRepositoryId, { path });
		},
		uploadFileLoading: false,
	}), { name: 'resourcesStore' }
))
