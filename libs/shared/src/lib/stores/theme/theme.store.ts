import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface IThemeStoreState {
	theme: string;
	setTheme: (theme: string) => void;
}

export const useThemeStore = create<IThemeStoreState>()(devtools(
	persist(
		(set) => ({
			theme: 'light',
			setTheme: (theme) => set({ theme }),
		}), { name: 'themeStore' }
	), { name: 'themeStore' }
))
