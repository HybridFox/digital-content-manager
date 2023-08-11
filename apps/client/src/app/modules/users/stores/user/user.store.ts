import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { DEFAULT_PAGINATION_OPTIONS, IUser, kyInstance, useAuthStore, wrapApi } from '@ibs/shared';

import { IUserStoreState, IUsersResponse } from './user.types';

export const useUserStore = create<IUserStoreState>()(devtools(
	(set) => ({
		fetchUsers: async (searchParams) => {
			set(() => ({ usersLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/users`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<IUsersResponse>());

			if (error) {
				return set(() => ({ users: [], usersLoading: false }))
			}
			
			set(() => ({ users: result._embedded.users, usersLoading: false }));
		},
		users: [],
		usersLoading: false,

		fetchUser: async (workflowId) => {
			set(() => ({ userLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/users/${workflowId}`).json<IUser>());

			if (error) {
				set(() => ({ user: undefined, userLoading: false }));
				throw error;
			}
			
			set(() => ({ user: result, userLoading: false }));
		},
		user: undefined,
		userLoading: false,

		createUser: async (user) => {
			set(() => ({ createUserLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/users`, {
				json: user,
			}).json<IUser>());
			set(() => ({ createUserLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createUserLoading: false,

		updateUser: async (userId, data) => {
			set(() => ({ updateUserLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${activeSite?.id}/users/${userId}`, {
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

		removeUser: async (userId) => {
			set(() => ({ removeUserLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.delete(`/api/v1/sites/${activeSite?.id}/users/${userId}`).json<void>());

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
