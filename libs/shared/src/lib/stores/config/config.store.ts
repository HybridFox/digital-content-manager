import ky from 'ky';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services';
import { IConfig } from '../config';

import { IConfigStoreState } from './config.types';

export const useConfigStore = create<IConfigStoreState>()(devtools(
	(set) => ({
		fetchConfig: async () => {
			set(() => ({ configLoading: true }));
			const [result, error] = await wrapApi(ky.get(`/admin-api/v1/config`).json<IConfig>());

			if (error) {
				set(() => ({ config: undefined, configLoading: false }));
				throw error;
			}
			
			set(() => ({ config: result, configLoading: false }));
		},
		config: undefined,
		configLoading: false,

		updateConfig: async (data) => {
			set(() => ({ updateConfigLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/config`, {
				json: data,
			}).json<IConfig>());

			if (error) {
				set(() => ({ updateConfigLoading: false }));
				throw error;
			}
			
			set(() => ({ config: result, updateConfigLoading: false }));
			return result;
		},
		updateConfigLoading: false,
	}), { name: 'configStore' }
))
