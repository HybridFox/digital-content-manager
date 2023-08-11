import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { useAuthStore } from '../auth';
import { kyInstance, wrapApi } from '../../services';

import { IStorageRepository, IStorageRepositoryStoreState, IStorageRepositoriesResponse } from './storage-repository.types';

export const useStorageRepositoryStore = create<IStorageRepositoryStoreState>()(devtools(
	(set) => ({
		fetchStorageRepositories: async (params) => {
			set(() => ({ storageRepositoriesLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/storage-repositories`, {
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

		fetchStorageRepository: async (storageRepositoryId) => {
			set(() => ({ storageRepositoryLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/storageRepository/${storageRepositoryId}`).json<IStorageRepository>());

			if (error) {
				set(() => ({ storageRepository: undefined, storageRepositoryLoading: false }));
				throw error;
			}
			
			set(() => ({ storageRepository: result, contentLoading: false }));
			return result;
		},
		storageRepository: undefined,
		storageRepositoryLoading: false,

		createStorageRepository: async (storageRepository) => {
			set(() => ({ createStorageRepositoryLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/storageRepositories`, {
				json: storageRepository,
			}).json<IStorageRepository>());
			set(() => ({ createStorageRepositoryLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createStorageRepositoryLoading: false,

		updateStorageRepository: async (contentId, data) => {
			set(() => ({ updateStorageRepositoryLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${activeSite?.id}/content/${contentId}`, {
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
