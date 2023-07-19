import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { kyAuthInstance, kyInstance, wrapApi } from '../../services';
import { ISite } from '../../types';

import { IMeReponse, IUser } from './auth.types';

interface IAuthStoreState {
	user?: IUser;
	sites: ISite[];
	token?: string;
	// TODO: Move this to another store perhaps?
	selectedSiteId?: string;
	fetchUser: () => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<IAuthStoreState>()(devtools(
	persist(
		(set) => ({
			sites: [],
			fetchUser: async () => {
				const [result, error] = await wrapApi(kyInstance.get('/api/v1/auth/me').json<IMeReponse>());

				if (error) {
					set(() => ({ user: undefined, token: undefined, sites: [] }));
					throw error;
				}
				
				set(() => ({ ...result }));
			},
			login: async (email, password) => {
				const [result, error] = await wrapApi(kyAuthInstance.post('/api/v1/auth/local/login', {
					json: { email, password }
				}).json<IMeReponse>());

				if (error) {
					throw error;
				}

				set(() => ({ ...result, selectedSiteId: result.sites?.[0]?.id }));
			} 
		}), { name: 'authStore' }
	), { name: 'authStore' }
))
