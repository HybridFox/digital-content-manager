import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services';

import { IAuthenticationMethodRoleAssignment, IAuthenticationMethodRoleAssignmentStoreState, IAuthenticationMethodRoleAssignmentsResponse } from './authentication-method-role-assignment.types';

export const useAuthenticationMethodRoleAssignmentStore = create<IAuthenticationMethodRoleAssignmentStoreState>()(devtools(
	(set) => ({
		fetchAuthenticationMethodRoleAssignments: async (authenticationMethodId, params) => {
			set(() => ({ authenticationMethodRoleAssignmentsLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/authentication-methods/${authenticationMethodId}/role-assignments`, {
				searchParams: {
					...(params || {})
				}
			}).json<IAuthenticationMethodRoleAssignmentsResponse>());

			if (error) {
				set(() => ({ authenticationMethodRoleAssignments: [], authenticationMethodRoleAssignmentsLoading: false }));
				return []
			}
			
			set(() => ({ authenticationMethodRoleAssignments: result._embedded.authenticationMethodRoleAssignments, authenticationMethodRoleAssignmentsLoading: false }));
			return result._embedded.authenticationMethodRoleAssignments;
		},
		authenticationMethodRoleAssignments: [],
		authenticationMethodRoleAssignmentsLoading: false,

		fetchAuthenticationMethodRoleAssignment: async (authenticationMethodId, authenticationMethodRoleAssignmentId) => {
			set(() => ({ authenticationMethodRoleAssignmentLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/authentication-methods/${authenticationMethodId}/role-assignments/${authenticationMethodRoleAssignmentId}`).json<IAuthenticationMethodRoleAssignment>());

			if (error) {
				set(() => ({ authenticationMethodRoleAssignment: undefined, authenticationMethodRoleAssignmentLoading: false }));
				throw error;
			}
			
			set(() => ({ authenticationMethodRoleAssignment: result, authenticationMethodRoleAssignmentLoading: false }));
			return result;
		},
		authenticationMethodRoleAssignment: undefined,
		authenticationMethodRoleAssignmentLoading: false,

		createAuthenticationMethodRoleAssignment: async (authenticationMethodId, authenticationMethodRoleAssignment) => {
			set(() => ({ createAuthenticationMethodRoleAssignmentLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/authentication-methods/${authenticationMethodId}/role-assignments`, {
				json: authenticationMethodRoleAssignment,
			}).json<IAuthenticationMethodRoleAssignment>());
			set(() => ({ createAuthenticationMethodRoleAssignmentLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createAuthenticationMethodRoleAssignmentLoading: false,

		updateAuthenticationMethodRoleAssignment: async (authenticationMethodId, authenticationMethodRoleAssignmentId, data) => {
			set(() => ({ updateAuthenticationMethodRoleAssignmentLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/authentication-methods/${authenticationMethodId}/role-assignments/${authenticationMethodRoleAssignmentId}`, {
				json: data,
			}).json<IAuthenticationMethodRoleAssignment>());

			if (error) {
				set(() => ({ updateAuthenticationMethodRoleAssignmentLoading: false }));
				throw error;
			}
			
			set(() => ({ authenticationMethodRoleAssignment: result, updateAuthenticationMethodRoleAssignmentLoading: false }));
			return result;
		},
		updateAuthenticationMethodRoleAssignmentLoading: false,

		removeAuthenticationMethodRoleAssignment: async (authenticationMethodId, authenticationMethodRoleAssignmentId) => {
			set(() => ({ removeAuthenticationMethodRoleAssignmentLoading: true }));
			const [, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/authentication-methods/${authenticationMethodId}/role-assignments/${authenticationMethodRoleAssignmentId}`).json<IAuthenticationMethodRoleAssignment>());

			if (error) {
				set(() => ({ removeAuthenticationMethodRoleAssignmentLoading: false }));
				throw error;
			}
			
			set(() => ({ removeAuthenticationMethodRoleAssignmentLoading: false }));
		},
		removeAuthenticationMethodRoleAssignmentLoading: false,
	}), { name: 'authenticationMethodRoleAssignmentStore' }
))
