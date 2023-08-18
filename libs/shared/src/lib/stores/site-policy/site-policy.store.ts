import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services';
import { DEFAULT_PAGINATION_OPTIONS } from '../../const';
import { IPolicy } from '../policy';

import { ISitePolicyStoreState, ISitePoliciesResponse } from './site-policy.types';

export const useSitePolicyStore = create<ISitePolicyStoreState>()(devtools(
	(set) => ({
		fetchPolicies: async (siteId, searchParams) => {
			set(() => ({ policiesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/iam-policies`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<ISitePoliciesResponse>());

			if (error) {
				return set(() => ({ policies: [], policiesLoading: false }))
			}
			
			set(() => ({ policies: result._embedded.sitePolicies, policiesPagination: result._page, policiesLoading: false }));
		},
		policies: [],
		policiesLoading: false,

		fetchPolicy: async (siteId, workflowId) => {
			set(() => ({ policyLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/iam-policies/${workflowId}`).json<IPolicy>());

			if (error) {
				set(() => ({ policy: undefined, policyLoading: false }));
				throw error;
			}
			
			set(() => ({ policy: result, policyLoading: false }));
		},
		policy: undefined,
		policyLoading: false,

		createPolicy: async (siteId, policy) => {
			set(() => ({ createPolicyLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/sites/${siteId}/iam-policies`, {
				json: policy,
			}).json<IPolicy>());
			set(() => ({ createPolicyLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createPolicyLoading: false,

		updatePolicy: async (siteId, policyId, data) => {
			set(() => ({ updatePolicyLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/sites/${siteId}/iam-policies/${policyId}`, {
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

		removePolicy: async (siteId, policyId) => {
			set(() => ({ removePolicyLoading: true }));
			const [result, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/sites/${siteId}/iam-policies/${policyId}`).json<void>());

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
