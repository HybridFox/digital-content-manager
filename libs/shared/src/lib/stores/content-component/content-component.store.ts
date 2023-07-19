import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { kyInstance, wrapApi } from '../../services/ky.instance';
import { IGenericPageOptions } from '../../types/paging.types';
import { useAuthStore } from '../auth';

import { IContentComponent, IContentComponentsResponse } from './content-component.types';

interface IContentComponentStoreState {
	contentComponents: IContentComponent[];
	fetchContentComponents: (
		props: IGenericPageOptions
	) => Promise<void>;
}

export const useContentComponentStore = create<IContentComponentStoreState>()(
	devtools(
		(set) => ({
			contentComponents: [],
			fetchContentComponents: async (options) => {
				const { selectedSiteId } = useAuthStore.getState();
				const [result, error] = await wrapApi(
					kyInstance
						.get(
							`/api/v1/sites/${selectedSiteId}/content-components`,
							{
								searchParams: {
									...options,
								},
							}
						)
						.json<IContentComponentsResponse>()
				);

				if (error) {
					return set(() => ({ contentComponents: [] }));
				}

				set(() => ({ contentComponents: result._embedded.contentComponents }));
			},
		}),
		{ name: 'contentComponentStore' }
	)
);
