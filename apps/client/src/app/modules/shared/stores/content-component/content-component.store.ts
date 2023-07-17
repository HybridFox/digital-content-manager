import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';

import { IContentComponent } from './content-component.types';

interface IContentComponentStoreState {
	contentComponents: IContentComponent[];
	fetchContentComponents: () => Promise<void>;
}

export const useContentComponentStore = create<IContentComponentStoreState>()(devtools(
	(set) => ({
		contentComponents: [],
		fetchContentComponents: async () => {
			const [result, error] = await wrapApi(kyInstance.get('/api/v1/auth/me').json<any>());
			if (error) {
				return set(() => ({ contentComponents: [] }))
			}
			
			set(() => ({ ...result }));
		}
	}), { name: 'contentComponentStore' }
))
