import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services';

import { IModule, IModuleStoreState, IModulesResponse } from './module.types';

export const useModuleStore = create<IModuleStoreState>()(devtools(
	(set) => ({
		fetchModules: async (siteId, params) => {
			set(() => ({ modulesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/modules`, {
				searchParams: {
					...(params || {})
				}
			}).json<IModulesResponse>());

			if (error) {
				set(() => ({ modules: [], modulesLoading: false }));
				return []
			}
			
			set(() => ({ modules: result._embedded.modules, modulesPagination: result._page, modulesLoading: false }));
			return result._embedded.modules;
		},
		modules: [],
		modulesLoading: false,

		fetchModule: async (siteId, moduleId) => {
			set(() => ({ moduleLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/modules/${moduleId}`).json<IModule>());

			if (error) {
				set(() => ({ module: undefined, moduleLoading: false }));
				throw error;
			}
			
			set(() => ({ module: result, moduleLoading: false }));
			return result;
		},
		module: undefined,
		moduleLoading: false,

		createModule: async (siteId, module) => {
			set(() => ({ createModuleLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/sites/${siteId}/modules`, {
				json: module,
			}).json<IModule>());
			set(() => ({ createModuleLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createModuleLoading: false,

		updateModule: async (siteId, moduleId, data) => {
			set(() => ({ updateModuleLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/sites/${siteId}/modules/${moduleId}`, {
				json: data,
			}).json<IModule>());

			if (error) {
				set(() => ({ updateModuleLoading: false }));
				throw error;
			}
			
			set(() => ({ module: result, updateModuleLoading: false }));
			return result;
		},
		updateModuleLoading: false,

		removeModule: async (siteId, moduleId) => {
			set(() => ({ removeModuleLoading: true }));
			const [result, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/sites/${siteId}/modules/${moduleId}`).json<void>());

			if (error) {
				set(() => ({ removeModuleLoading: false }));
				throw error;
			}
			
			set(() => ({ removeModuleLoading: false }));
			return;
		},
		removeModuleLoading: false,
	}), { name: 'siteModuleStore' }
))
