import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { useAuthStore } from '../auth';
import { kyInstance, wrapApi } from '../../services';
import { DEFAULT_PAGINATION_OPTIONS } from '../../const';

import { IPolicyStoreState, IPoliciesResponse, IPolicy } from './policy.types';

export const usePolicyStore = create<IPolicyStoreState>()(devtools(
	(set) => ({
		fetchPolicies: async (searchParams) => {
			set(() => ({ policiesLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/iam-policies`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<IPoliciesResponse>());

			if (error) {
				return set(() => ({ policies: [], policiesLoading: false }))
			}
			
			set(() => ({ policies: result._embedded.policies, policiesLoading: false }));
		},
		policies: [],
		policiesLoading: false,

		fetchPolicy: async (workflowId) => {
			set(() => ({ policyLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/iam-policies/${workflowId}`).json<IPolicy>());

			if (error) {
				set(() => ({ policy: undefined, policyLoading: false }));
				throw error;
			}
			
			set(() => ({ policy: result, policyLoading: false }));
		},
		policy: undefined,
		policyLoading: false,

		createPolicy: async (policy) => {
			set(() => ({ createPolicyLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/iam-policies`, {
				json: policy,
			}).json<IPolicy>());
			set(() => ({ createPolicyLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createPolicyLoading: false,

		updatePolicy: async (policyId, data) => {
			set(() => ({ updatePolicyLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${activeSite?.id}/iam-policies/${policyId}`, {
				json: data,
			}).json<IPolicy>());

			if (error) {
				set(() => ({ updatePolicyLoading: false }));
				throw error;
			}
			
			set(() => ({ workflow: result, updatePolicyLoading: false }));
			return result;
		},
		updatePolicyLoading: false,

		removePolicy: async (policyId) => {
			set(() => ({ removePolicyLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.delete(`/api/v1/sites/${activeSite?.id}/iam-policies/${policyId}`).json<void>());

			if (error) {
				set(() => ({ removePolicyLoading: false }));
				throw error;
			}
			
			set(() => ({ removePolicyLoading: false }));
			return result;
		},
		removePolicyLoading: false,
	}), { name: 'policyStore' }
))
