import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { wrapApi, kyAuthInstance } from '../../services';

import { IStatus } from './status.types';

interface IStatusStoreState {
	status?: IStatus;
	fetchStatus: () => void;
}

export const useStatusStore = create<IStatusStoreState>()(devtools(
	(set) => ({
		fetchStatus: async () => {
			const [status, error] = await wrapApi(kyAuthInstance.get(`/admin-api/v1/status`).json<IStatus>());

			if (error) {
				return;
			}

			set(() => ({ status }));
		},
	}), { name: 'statusStore' }
))
