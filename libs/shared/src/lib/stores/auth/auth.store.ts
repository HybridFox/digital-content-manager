import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { kyAuthInstance, kyInstance, wrapApi } from '../../services';
import { ISite } from '../../types';

import { IMeReponse, IRole, IUser } from './auth.types';

interface IAuthStoreState {
	user?: IUser;
	sites: ISite[];
	roles: IRole[];
	activeSite?: ISite;
	token?: string;
	// TODO: Move this to another store perhaps?
	fetchUser: () => Promise<void>;
	setup: (values: any) => Promise<void>;
	loginLocal: (authenticationMethodId: string, email: string, password: string) => Promise<void>;
	login: (authenticationMethodId: string) => Promise<{ redirect: string }>;
	callback: (authenticationMethodId: string, code: string) => Promise<void>;
	clear: () => void;
}

export const useAuthStore = create<IAuthStoreState>()(devtools(
	persist(
		(set) => ({
			sites: [],
			roles: [],
			clear: () => set({ sites: [], roles: [], activeSite: undefined, token: undefined, user: undefined }),
			fetchUser: async () => {
				const [result, error] = await wrapApi(kyInstance.get('/admin-api/v1/auth/me').json<IMeReponse>());

				if (error) {
					set(() => ({ user: undefined, token: undefined, sites: [] }));
					throw error;
				}
				
				set(() => ({ ...result, activeSite: result.sites?.[0] }));
			},
			callback: async (authenticationMethodId, code) => {
				const [result, error] = await wrapApi(kyAuthInstance.post(`/admin-api/v1/auth/${authenticationMethodId}/callback`, {
					json: {},
					searchParams: { code }
				}).json<IMeReponse>());

				if (error) {
					throw error;
				}

				set(() => ({ ...result, activeSite: result.sites?.[0] }));
			},
			loginLocal: async (authenticationMethodId, email, password) => {
				const [result, error] = await wrapApi(kyAuthInstance.post(`/admin-api/v1/auth/${authenticationMethodId}/login`, {
					json: { email, password }
				}).json<IMeReponse>());

				if (error) {
					throw error;
				}

				set(() => ({ ...result, activeSite: result.sites?.[0] }));
			},
			login: async (authenticationMethodId) => {
				const [result, error] = await wrapApi(kyAuthInstance.post(`/admin-api/v1/auth/${authenticationMethodId}/login`, {
					json: {}
				}).json<{ redirect: string }>());

				if (error) {
					throw error;
				}
				
				return result;
			},
			setup: async (values) => {
				const [result, error] = await wrapApi(kyInstance.post('/admin-api/v1/setup/register', {
					json: values
				}).json<IMeReponse>());
	
				if (error) {
					throw error;
				}
	
				set(() => ({ ...result, activeSite: result.sites?.[0] }));
			} 
		}), { name: 'authStore' }
	), { name: 'authStore' }
))
