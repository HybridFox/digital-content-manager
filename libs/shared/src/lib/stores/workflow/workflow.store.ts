import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';
import { useAuthStore } from '../auth';
import { DEFAULT_PAGINATION_OPTIONS } from '../../const';

import { IWorkflow, IWorkflowStoreState, IWorkflowsResponse } from './workflow.types';

export const useWorkflowStore = create<IWorkflowStoreState>()(devtools(
	(set) => ({
		fetchWorkflows: async (searchParams) => {
			set(() => ({ workflowsLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/workflows`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<IWorkflowsResponse>());

			if (error) {
				return set(() => ({ workflows: [], workflowsLoading: false }))
			}
			
			set(() => ({ workflows: result._embedded.workflows, workflowsLoading: false }));
		},
		workflows: [],
		workflowsLoading: false,

		fetchWorkflow: async (workflowId) => {
			set(() => ({ workflowLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/workflows/${workflowId}`).json<IWorkflow>());

			if (error) {
				set(() => ({ workflow: undefined, workflowLoading: false }));
				throw error;
			}
			
			set(() => ({ workflow: result, workflowLoading: false }));
		},
		workflow: undefined,
		workflowLoading: false,

		createWorkflow: async (workflow) => {
			set(() => ({ createWorkflowLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/workflows`, {
				json: {
					...workflow,
					fields: []
				},
			}).json<IWorkflow>());
			set(() => ({ createWorkflowLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createWorkflowLoading: false,

		updateWorkflow: async (workflowId, data) => {
			set(() => ({ updateWorkflowLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${activeSite?.id}/workflows/${workflowId}`, {
				json: data,
			}).json<IWorkflow>());

			if (error) {
				set(() => ({ updateWorkflowLoading: false }));
				throw error;
			}
			
			set(() => ({ workflow: result, updateWorkflowLoading: false }));
			return result;
		},
		updateWorkflowLoading: false,
	}), { name: 'workflowStore' }
))
