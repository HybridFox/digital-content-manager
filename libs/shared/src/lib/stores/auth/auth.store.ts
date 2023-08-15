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
	login: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<IAuthStoreState>()(devtools(
	persist(
		(set) => ({
			sites: [],
			roles: [],
			fetchUser: async () => {
				const [result, error] = await wrapApi(kyInstance.get('/api/v1/auth/me').json<IMeReponse>());

				if (error) {
					set(() => ({ user: undefined, token: undefined, sites: [] }));
					throw error;
				}
				
				set(() => ({ ...result, activeSite: result.sites?.[0] }));
			},
			login: async (email, password) => {
				const [result, error] = await wrapApi(kyAuthInstance.post('/api/v1/auth/local/login', {
					json: { email, password }
				}).json<IMeReponse>());

				if (error) {
					throw error;
				}

				set(() => ({ ...result, activeSite: result.sites?.[0] }));
			},
			setup: async (values) => {
				const [result, error] = await wrapApi(kyInstance.post('/api/v1/setup/register', {
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
