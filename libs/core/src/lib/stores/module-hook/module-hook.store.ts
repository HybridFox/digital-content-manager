import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { IModuleHookStoreState } from './module-hook.types';

export const useModuleHookStore = create<IModuleHookStoreState>()(devtools(
	(set) => ({
		menuGroups: [],
		routes: [],
		registerSiteModule: async (moduleOptions) => {
			set(({ menuGroups, routes }) => ({
				menuGroups: [...menuGroups, ...(moduleOptions.menuGroups || [])],
				routes: [...routes, ...(moduleOptions.routes || [])],
			}));
		}
	}), { name: 'moduleHookStore' }
))
