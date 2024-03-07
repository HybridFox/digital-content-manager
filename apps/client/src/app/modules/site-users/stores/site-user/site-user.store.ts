import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { ISiteUserStoreState, ISiteUsersResponse } from './site-user.types';

import { DEFAULT_PAGINATION_OPTIONS, IUser, kyInstance, wrapApi } from '~shared';


export const useSiteUserStore = create<ISiteUserStoreState>()(devtools(
	(set) => ({
		fetchUsers: async (siteId, searchParams) => {
			set(() => ({ usersLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/users`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<ISiteUsersResponse>());

			if (error) {
				return set(() => ({ users: [], usersLoading: false }))
			}
			
			set(() => ({ users: result._embedded.users, usersPagination: result._page, usersLoading: false }));
		},
		users: [],
		usersLoading: false,

		fetchUser: async (siteId, workflowId) => {
			set(() => ({ userLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/users/${workflowId}`).json<IUser>());

			if (error) {
				set(() => ({ user: undefined, userLoading: false }));
				throw error;
			}
			
			set(() => ({ user: result, userLoading: false }));
		},
		user: undefined,
		userLoading: false,

		createUser: async (siteId, user) => {
			set(() => ({ createUserLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/sites/${siteId}/users`, {
				json: user,
			}).json<IUser>());
			set(() => ({ createUserLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createUserLoading: false,

		updateUser: async (siteId, userId, data) => {
			set(() => ({ updateUserLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/sites/${siteId}/users/${userId}`, {
				json: data,
			}).json<IUser>());

			if (error) {
				set(() => ({ updateUserLoading: false }));
				throw error;
			}
			
			set(() => ({ workflow: result, updateUserLoading: false }));
			return result;
		},
		updateUserLoading: false,

		removeUser: async (siteId, userId) => {
			set(() => ({ removeUserLoading: true }));
			const [result, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/sites/${siteId}/users/${userId}`).json<void>());

			if (error) {
				set(() => ({ removeUserLoading: false }));
				throw error;
			}
			
			set(() => ({ removeUserLoading: false }));
			return result;
		},
		removeUserLoading: false,
	}), { name: 'userStore' }
))
