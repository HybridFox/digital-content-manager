import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { kyInstance, wrapApi } from '@ibs/shared';

import { ISetupStoreState } from './setup.types';

export const useSetupStore = create<ISetupStoreState>()(devtools(
	(set) => ({
		setup: async (values) => {
			const [_, error] = await wrapApi(kyInstance.post('/api/v1/setup/register', {
				json: values
			}).json<void>());

			if (error) {
				throw error;
			}

			return;
		} 
	}), { name: 'setupStore' }
))
