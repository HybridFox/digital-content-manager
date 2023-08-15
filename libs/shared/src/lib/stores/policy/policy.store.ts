import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services';
import { DEFAULT_PAGINATION_OPTIONS } from '../../const';

import { IPolicyStoreState, IPoliciesResponse, IPolicy } from './policy.types';

export const usePolicyStore = create<IPolicyStoreState>()(devtools(
	(set) => ({
		fetchPolicies: async (searchParams) => {
			set(() => ({ policiesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/iam-policies`, {
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

		fetchPolicy: async (policyId) => {
			set(() => ({ policyLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/iam-policies/${policyId}`).json<IPolicy>());

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
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/iam-policies`, {
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
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/iam-policies/${policyId}`, {
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
			const [result, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/iam-policies/${policyId}`).json<void>());

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
