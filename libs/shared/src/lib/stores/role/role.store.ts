import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { IRole, useAuthStore } from '../auth';
import { kyInstance, wrapApi } from '../../services';
import { DEFAULT_PAGINATION_OPTIONS } from '../../const';

import { IRoleStoreState, IRolesResponse } from './role.types';

export const useRoleStore = create<IRoleStoreState>()(devtools(
	(set) => ({
		fetchRoles: async (searchParams) => {
			set(() => ({ rolesLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/roles`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<IRolesResponse>());

			if (error) {
				return set(() => ({ roles: [], rolesLoading: false }))
			}
			
			set(() => ({ roles: result._embedded.roles, rolesLoading: false }));
		},
		roles: [],
		rolesLoading: false,

		fetchRole: async (workflowId) => {
			set(() => ({ roleLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/roles/${workflowId}`).json<IRole>());

			if (error) {
				set(() => ({ role: undefined, roleLoading: false }));
				throw error;
			}
			
			set(() => ({ role: result, roleLoading: false }));
		},
		role: undefined,
		roleLoading: false,

		createRole: async (role) => {
			set(() => ({ createRoleLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/roles`, {
				json: role,
			}).json<IRole>());
			set(() => ({ createRoleLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createRoleLoading: false,

		updateRole: async (roleId, data) => {
			set(() => ({ updateRoleLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${activeSite?.id}/roles/${roleId}`, {
				json: data,
			}).json<IRole>());

			if (error) {
				set(() => ({ updateRoleLoading: false }));
				throw error;
			}
			
			set(() => ({ workflow: result, updateRoleLoading: false }));
			return result;
		},
		updateRoleLoading: false,

		removeRole: async (roleId) => {
			set(() => ({ removeRoleLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.delete(`/api/v1/sites/${activeSite?.id}/roles/${roleId}`).json<void>());

			if (error) {
				set(() => ({ removeRoleLoading: false }));
				throw error;
			}
			
			set(() => ({ removeRoleLoading: false }));
			return result;
		},
		removeRoleLoading: false,
	}), { name: 'roleStore' }
))
