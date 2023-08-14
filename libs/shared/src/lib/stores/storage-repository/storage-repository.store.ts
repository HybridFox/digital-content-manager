import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services';

import { IStorageRepository, IStorageRepositoryStoreState, IStorageRepositoriesResponse } from './storage-repository.types';

export const useStorageRepositoryStore = create<IStorageRepositoryStoreState>()(devtools(
	(set) => ({
		fetchStorageRepositories: async (siteId, params) => {
			set(() => ({ storageRepositoriesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${siteId}/storage-repositories`, {
				searchParams: {
					...(params || {})
				}
			}).json<IStorageRepositoriesResponse>());

			if (error) {
				set(() => ({ storageRepositories: [], storageRepositoriesLoading: false }));
				return []
			}
			
			set(() => ({ storageRepositories: result._embedded.storageRepositories, storageRepositoriesLoading: false }));
			return result._embedded.storageRepositories;
		},
		storageRepositories: [],
		storageRepositoriesLoading: false,

		fetchStorageRepository: async (siteId, storageRepositoryId) => {
			set(() => ({ storageRepositoryLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${siteId}/storage-repositories/${storageRepositoryId}`).json<IStorageRepository>());

			if (error) {
				set(() => ({ storageRepository: undefined, storageRepositoryLoading: false }));
				throw error;
			}
			
			set(() => ({ storageRepository: result, storageRepositoryLoading: false }));
			return result;
		},
		storageRepository: undefined,
		storageRepositoryLoading: false,

		createStorageRepository: async (siteId, storageRepository) => {
			set(() => ({ createStorageRepositoryLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${siteId}/storage-repositories`, {
				json: storageRepository,
			}).json<IStorageRepository>());
			set(() => ({ createStorageRepositoryLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createStorageRepositoryLoading: false,

		updateStorageRepository: async (siteId, storageRepositoryId, data) => {
			set(() => ({ updateStorageRepositoryLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${siteId}/storage-repositories/${storageRepositoryId}`, {
				json: data,
			}).json<IStorageRepository>());

			if (error) {
				set(() => ({ updateStorageRepositoryLoading: false }));
				throw error;
			}
			
			set(() => ({ storageRepository: result, updateStorageRepositoryLoading: false }));
			return result;
		},
		updateStorageRepositoryLoading: false,
	}), { name: 'storageRepositoryStore' }
))
