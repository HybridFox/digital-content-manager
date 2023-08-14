import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { IRole } from '../auth';
import { kyInstance, wrapApi } from '../../services';
import { DEFAULT_PAGINATION_OPTIONS } from '../../const';

import { ISiteRoleStoreState, ISiteRolesResponse } from './site-role.types';

export const useSiteRoleStore = create<ISiteRoleStoreState>()(devtools(
	(set) => ({
		fetchRoles: async (siteId, searchParams) => {
			set(() => ({ rolesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${siteId}/roles`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<ISiteRolesResponse>());

			if (error) {
				return set(() => ({ roles: [], rolesLoading: false }))
			}
			
			set(() => ({ roles: result._embedded.siteRoles, rolesLoading: false }));
		},
		roles: [],
		rolesLoading: false,

		fetchRole: async (siteId, workflowId) => {
			set(() => ({ roleLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${siteId}/roles/${workflowId}`).json<IRole>());

			if (error) {
				set(() => ({ role: undefined, roleLoading: false }));
				throw error;
			}
			
			set(() => ({ role: result, roleLoading: false }));
		},
		role: undefined,
		roleLoading: false,

		createRole: async (siteId, role) => {
			set(() => ({ createRoleLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${siteId}/roles`, {
				json: role,
			}).json<IRole>());
			set(() => ({ createRoleLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createRoleLoading: false,

		updateRole: async (siteId, roleId, data) => {
			set(() => ({ updateRoleLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${siteId}/roles/${roleId}`, {
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

		removeRole: async (siteId, roleId) => {
			set(() => ({ removeRoleLoading: true }));
			const [result, error] = await wrapApi(kyInstance.delete(`/api/v1/sites/${siteId}/roles/${roleId}`).json<void>());

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
