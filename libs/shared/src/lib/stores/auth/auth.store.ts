import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { kyAuthInstance, kyInstance, wrapApi } from '../../services';
import { ISite } from '../../types';

import { IMeReponse, IPermission, IUser } from './auth.types';

interface IAuthStoreState {
	user?: IUser;
	permissions: IPermission[];
	token?: string;
	activeSite?: ISite;
	theme: string;
	// TODO: Move this to another store perhaps?
	setTheme: (theme: string) => void;
	fetchUser: (siteId?: string) => Promise<void>;
	fetchSite: (siteId: string) => Promise<void>;
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
			permissions: [],
			theme: 'light',
			clear: () => set({ permissions: [], activeSite: undefined, token: undefined, user: undefined }),
			setTheme: (theme) => set({ theme }),
			fetchUser: async (siteId) => {
				const [result, error] = await wrapApi(kyInstance.get('/admin-api/v1/auth/me', {
					searchParams: {
						...(siteId && { siteId })
					}
				}).json<IMeReponse>());

				if (error) {
					set(() => ({ user: undefined, token: undefined, sites: [] }));
					throw error;
				}
				
				set(() => ({ ...result }));
			},
			fetchSite: async (siteId) => {
				const [activeSite, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}`).json<ISite>());

				if (error) {
					set(() => ({ user: undefined, token: undefined, sites: [] }));
					throw error;
				}
				
				set(() => ({ activeSite }));
			},
			callback: async (authenticationMethodId, code) => {
				const [result, error] = await wrapApi(kyAuthInstance.post(`/admin-api/v1/auth/${authenticationMethodId}/callback`, {
					json: {},
					searchParams: { code }
				}).json<IMeReponse>());

				if (error) {
					throw error;
				}

				set(() => ({ ...result }));
			},
			loginLocal: async (authenticationMethodId, email, password) => {
				const [result, error] = await wrapApi(kyAuthInstance.post(`/admin-api/v1/auth/${authenticationMethodId}/login`, {
					json: { email, password }
				}).json<IMeReponse>());

				if (error) {
					throw error;
				}

				set(() => ({ ...result }));
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
	
				set(() => ({ ...result }));
			} 
		}), { name: 'authStore' }
	), { name: 'authStore' }
))
