import { create } from 'zustand'
import ky from 'ky';
import { devtools } from 'zustand/middleware'

import { IUser } from '../types/user.types';

interface IAuthStoreState {
	user?: IUser;
	fetchUser: () => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
}

const kyInstance = ky.extend({
	hooks: {
		beforeError: [async (error) => {
			const errorBody = await error.response.json();
			return errorBody;
		}]
	}
})

export const useAuthStore = create<IAuthStoreState>()(devtools((set) => ({
	user: undefined,
	fetchUser: async () => {
		const user = await kyInstance.get('/api/v1/auth/me').json<IUser>();
		set(() => ({ user }));
	},
	login: async (email, password) => {
		const user = await kyInstance.post('/api/v1/auth/local/login', {
			json: { email, password }
		}).json<IUser>();

		set(() => ({ user }));
	} 
}), { name: 'authStore' }))
