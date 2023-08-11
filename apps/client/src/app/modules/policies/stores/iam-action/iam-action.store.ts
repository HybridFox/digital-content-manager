import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { DEFAULT_PAGINATION_OPTIONS, kyInstance, wrapApi } from '@ibs/shared';

import { IIAMActionStoreState, IIAMActionsResponse, IIAMAction } from './iam-action.types';

export const useIAMActionStore = create<IIAMActionStoreState>()(devtools(
	(set) => ({
		fetchIAMActions: async (searchParams) => {
			set(() => ({ iamActionsLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/iam-actions`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<IIAMActionsResponse>());

			if (error) {
				return set(() => ({ iamActions: [], iamActionsLoading: false }))
			}
			
			set(() => ({ iamActions: result._embedded.iamActions, iamActionsLoading: false }));
		},
		iamActions: [],
		iamActionsLoading: false,

		fetchIAMAction: async (iamAction) => {
			set(() => ({ iamActionLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/iam-actions/${iamAction}`).json<IIAMAction>());

			if (error) {
				set(() => ({ iamAction: undefined, iamActionLoading: false }));
				throw error;
			}
			
			set(() => ({ iamAction: result, iamActionLoading: false }));
		},
		iamAction: undefined,
		iamActionLoading: false
	}), { name: 'iamActionStore' }
))
