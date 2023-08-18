import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { IRole } from '../auth';
import { kyInstance, wrapApi } from '../../services';
import { DEFAULT_PAGINATION_OPTIONS } from '../../const';

import { IRoleStoreState, IRolesResponse } from './role.types';

export const useRoleStore = create<IRoleStoreState>()(devtools(
	(set) => ({
		fetchRoles: async (searchParams) => {
			set(() => ({ rolesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/roles`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<IRolesResponse>());

			if (error) {
				return set(() => ({ roles: [], rolesLoading: false }))
			}
			
			set(() => ({ roles: result._embedded.roles, rolesPagination: result._page, rolesLoading: false }));
		},
		roles: [],
		rolesLoading: false,

		fetchRole: async (roleId) => {
			set(() => ({ roleLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/roles/${roleId}`).json<IRole>());

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
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/roles`, {
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
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/roles/${roleId}`, {
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
			const [result, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/roles/${roleId}`).json<void>());

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
