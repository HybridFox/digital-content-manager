import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { IHeaderBreadcrumb } from './header.types';

interface IHeaderStoreState {
	breadcrumbs?: IHeaderBreadcrumb[];
	setBreadcrumbs: (breadcrumbs: IHeaderBreadcrumb[]) => void;
}

export const useHeaderStore = create<IHeaderStoreState>()(devtools(
	(set) => ({
		breadcrumbs: [],
		setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs })
	}), { name: 'headerStore' }
))
