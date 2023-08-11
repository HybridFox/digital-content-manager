import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { DEFAULT_PAGINATION_OPTIONS, IWorkflowState, kyInstance, useAuthStore, wrapApi } from '@ibs/shared';

import { IWorkflowStateStoreState, IWorkflowStatesResponse } from './workflow-state.types';

export const useWorkflowStateStore = create<IWorkflowStateStoreState>()(devtools(
	(set) => ({
		fetchWorkflowStates: async (searchParams) => {
			set(() => ({ workflowStatesLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/workflow-states`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<IWorkflowStatesResponse>());

			if (error) {
				return set(() => ({ workflowStates: [], workflowStatesLoading: false }))
			}
			
			set(() => ({ workflowStates: result._embedded.workflowStates, workflowStatesLoading: false }));
		},
		workflowStates: [],
		workflowStatesLoading: false,

		fetchWorkflowState: async (workflowId) => {
			set(() => ({ workflowStateLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/workflow-states/${workflowId}`).json<IWorkflowState>());

			if (error) {
				set(() => ({ workflowState: undefined, workflowStateLoading: false }));
				throw error;
			}
			
			set(() => ({ workflowState: result, workflowStateLoading: false }));
		},
		workflowState: undefined,
		workflowStateLoading: false,

		createWorkflowState: async (workflowState) => {
			set(() => ({ createWorkflowStateLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/workflow-states`, {
				json: workflowState,
			}).json<IWorkflowState>());
			set(() => ({ createWorkflowStateLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createWorkflowStateLoading: false,

		updateWorkflowState: async (workflowStateId, data) => {
			set(() => ({ updateWorkflowStateLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${activeSite?.id}/workflow-states/${workflowStateId}`, {
				json: data,
			}).json<IWorkflowState>());

			if (error) {
				set(() => ({ updateWorkflowStateLoading: false }));
				throw error;
			}
			
			set(() => ({ workflow: result, updateWorkflowStateLoading: false }));
			return result;
		},
		updateWorkflowStateLoading: false,

		removeWorkflowState: async (workflowStateId) => {
			set(() => ({ removeWorkflowStateLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.delete(`/api/v1/sites/${activeSite?.id}/workflow-states/${workflowStateId}`).json<void>());

			if (error) {
				set(() => ({ removeWorkflowStateLoading: false }));
				throw error;
			}
			
			set(() => ({ removeWorkflowStateLoading: false }));
			return result;
		},
		removeWorkflowStateLoading: false,
	}), { name: 'workflowStateStore' }
))
