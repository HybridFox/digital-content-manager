import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';

import { IContentType } from './content-type.types';

interface IContentTypeStoreState {
	contentComponents: IContentType[];
	fetchContentComponents: () => Promise<void>;
}

export const useContentTypeStore = create<IContentTypeStoreState>()(devtools(
	(set) => ({
		contentComponents: [],
		fetchContentComponents: async () => {
			const [result, error] = await wrapApi(kyInstance.get('/api/v1/sites/xyz/content-types').json<any>());
			if (error) {
				return set(() => ({ contentComponents: [] }))
			}
			
			set(() => ({ ...result }));
		}
	}), { name: 'contentTypeStore' }
))
