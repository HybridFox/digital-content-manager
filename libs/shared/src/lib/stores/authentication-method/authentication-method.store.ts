import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services';

import { IAuthenticationMethod, IAuthenticationMethodStoreState, IAuthenticationMethodsResponse } from './authentication-method.types';

export const useAuthenticationMethodStore = create<IAuthenticationMethodStoreState>()(devtools(
	(set) => ({
		fetchAuthenticationMethods: async (params) => {
			set(() => ({ authenticationMethodsLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/authentication-methods`, {
				searchParams: {
					...(params || {})
				}
			}).json<IAuthenticationMethodsResponse>());

			if (error) {
				set(() => ({ authenticationMethods: [], authenticationMethodsLoading: false }));
				return []
			}
			
			set(() => ({ authenticationMethods: result._embedded.authenticationMethods, authenticationMethodsPagination: result._page, authenticationMethodsLoading: false }));
			return result._embedded.authenticationMethods;
		},
		authenticationMethods: [],
		authenticationMethodsLoading: false,

		fetchAuthenticationMethod: async (authenticationMethodId) => {
			set(() => ({ authenticationMethodLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/authentication-methods/${authenticationMethodId}`).json<IAuthenticationMethod>());

			if (error) {
				set(() => ({ authenticationMethod: undefined, authenticationMethodLoading: false }));
				throw error;
			}
			
			set(() => ({ authenticationMethod: result, authenticationMethodLoading: false }));
			return result;
		},
		authenticationMethod: undefined,
		authenticationMethodLoading: false,

		createAuthenticationMethod: async (authenticationMethod) => {
			set(() => ({ createAuthenticationMethodLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/authentication-methods`, {
				json: authenticationMethod,
			}).json<IAuthenticationMethod>());
			set(() => ({ createAuthenticationMethodLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createAuthenticationMethodLoading: false,

		updateAuthenticationMethod: async (authenticationMethodId, data) => {
			set(() => ({ updateAuthenticationMethodLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/authentication-methods/${authenticationMethodId}`, {
				json: data,
			}).json<IAuthenticationMethod>());

			if (error) {
				set(() => ({ updateAuthenticationMethodLoading: false }));
				throw error;
			}
			
			set(() => ({ authenticationMethod: result, updateAuthenticationMethodLoading: false }));
			return result;
		},
		updateAuthenticationMethodLoading: false,
	}), { name: 'authenticationMethodStore' }
))
