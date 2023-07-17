import { create } from 'zustand'
import ky from 'ky';
import { devtools, persist } from 'zustand/middleware'

import { IMeReponse, IUser } from '../types/user.types';
import { ISite } from '../types/site.types';

interface IAuthStoreState {
	user?: IUser;
	sites: ISite[];
	token?: string;
	fetchUser: () => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
}

interface IError {
	message: string;
	ststus: number;
	identifier: string;
	code: string;
}

const kyInstance = ky.extend({
	hooks: {
		beforeRequest: [(request) => {
			const token = useAuthStore.getState().token;
			if (token) {
				request.headers.set('Authorization', `Bearer ${token}`);
			}

			return request;
		}],
		beforeError: [async (error) => {
			const errorBody = await error.response.json();
			return errorBody;
		}]
	}
})

const wrapFn = async <T = unknown, E = IError>(fn: Promise<T>): Promise<[T, null] | [null, E]> => fn
	.then((result) => [result, null] as [T, null])
	.catch((error) => [null, error])

export const useAuthStore = create<IAuthStoreState>()(devtools(
	persist(
		(set) => ({
			user: undefined,
			token: undefined,
			sites: [],
			fetchUser: async () => {
				const [result, error] = await wrapFn(kyInstance.get('/api/v1/auth/me').json<IMeReponse>());
				if (error) {
					return set(() => ({ user: undefined, token: undefined, sites: [] }))
				}
				
				set(() => ({ ...result }));
			},
			login: async (email, password) => {
				const { user, token, sites } = await kyInstance.post('/api/v1/auth/local/login', {
					json: { email, password }
				}).json<IMeReponse>();

				set(() => ({ user, token, sites }));
			} 
		}), { name: 'authStore' }
	), { name: 'authStore' }
))
