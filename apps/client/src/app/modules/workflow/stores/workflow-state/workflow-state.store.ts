import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { DEFAULT_PAGINATION_OPTIONS, IWorkflowState, kyInstance, useAuthStore, wrapApi } from '@ibs/shared';

import { IWorkflowStateStoreState, IWorkflowStatesResponse } from './workflow-state.types';

export const useWorkflowStateStore = create<IWorkflowStateStoreState>()(devtools(
	(set) => ({
		fetchWorkflowStates: async (siteId, searchParams) => {
			set(() => ({ workflowStatesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${siteId}/workflow-states`, {
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

		fetchWorkflowState: async (siteId, workflowId) => {
			set(() => ({ workflowStateLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${siteId}/workflow-states/${workflowId}`).json<IWorkflowState>());

			if (error) {
				set(() => ({ workflowState: undefined, workflowStateLoading: false }));
				throw error;
			}
			
			set(() => ({ workflowState: result, workflowStateLoading: false }));
		},
		workflowState: undefined,
		workflowStateLoading: false,

		createWorkflowState: async (siteId, workflowState) => {
			set(() => ({ createWorkflowStateLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${siteId}/workflow-states`, {
				json: workflowState,
			}).json<IWorkflowState>());
			set(() => ({ createWorkflowStateLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createWorkflowStateLoading: false,

		updateWorkflowState: async (siteId, workflowStateId, data) => {
			set(() => ({ updateWorkflowStateLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${siteId}/workflow-states/${workflowStateId}`, {
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

		removeWorkflowState: async (siteId, workflowStateId) => {
			set(() => ({ removeWorkflowStateLoading: true }));
			const [result, error] = await wrapApi(kyInstance.delete(`/api/v1/sites/${siteId}/workflow-states/${workflowStateId}`).json<void>());

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
