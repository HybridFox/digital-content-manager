import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { kyInstance, wrapApi } from '../../services/ky.instance';
import { useAuthStore } from '../auth';

import { IContentComponent, IContentComponentStoreState, IContentComponentsResponse } from './content-component.types';

export const useContentComponentStore = create<IContentComponentStoreState>()(
	devtools(
		(set) => ({
			fetchContentComponents: async (options) => {
				const { activeSite } = useAuthStore.getState();
				const [result, error] = await wrapApi(
					kyInstance
						.get(
							`/api/v1/sites/${activeSite?.id}/content-components`,
							{
								searchParams: {
									...options,
								},
							}
						)
						.json<IContentComponentsResponse>()
				);

				if (error) {
					set(() => ({ contentComponents: [], contentComponentsLoading: false }));
					throw error;
				}

				set(() => ({ contentComponents: result._embedded.contentComponents, contentComponentsLoading: false }));
			},
			contentComponents: [],
			contentComponentsLoading: false,

			fetchContentComponent: async (contentComponentId) => {
				set(() => ({ contentComponentLoading: true }));
				const { activeSite } = useAuthStore.getState();
				const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/content-components/${contentComponentId}`).json<IContentComponent>());
	
				if (error) {
					set(() => ({ contentComponent: undefined, contentComponentLoading: false }));
					throw error;
				}
				
				set(() => ({ contentComponent: result, contentComponentLoading: false }));
				return result;
			},
			contentComponent: undefined,
			contentComponentLoading: false,
	
			createContentComponent: async (contentComponent) => {
				set(() => ({ createContentComponentLoading: true }));
				const { activeSite } = useAuthStore.getState();
				const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/content-components`, {
					json: {
						...contentComponent,
						fields: []
					},
				}).json<IContentComponent>());
				set(() => ({ createContentComponentLoading: false }));
	
				if (error) {
					throw error;
				}
				
				return result;
			},
			createContentComponentLoading: false,
	
			updateContentComponent: async (contentComponentId, data) => {
				set(() => ({ updateContentComponentLoading: true }));
				const { activeSite } = useAuthStore.getState();
				const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${activeSite?.id}/content-components/${contentComponentId}`, {
					json: data,
				}).json<IContentComponent>());
	
				if (error) {
					set(() => ({ updateContentComponentLoading: false }));
					throw error;
				}
				
				set(() => ({ contentComponent: result, updateContentComponentLoading: false }));
				return result;
			},
			updateContentComponentLoading: false,
		}),
		{ name: 'contentComponentStore' }
	)
);
