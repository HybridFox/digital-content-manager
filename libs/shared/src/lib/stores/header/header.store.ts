import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { IHeaderBreadcrumb } from './header.types';

interface IHeaderStoreState {
	breadcrumbs?: IHeaderBreadcrumb[];
	setBreadcrumbs: (breadcrumbs: IHeaderBreadcrumb[]) => void;

	title?: string;
	setTitle: (title: string) => void;
}

export const useHeaderStore = create<IHeaderStoreState>()(devtools(
	(set) => ({
		breadcrumbs: [],
		setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
		setTitle: (title) => set({ title })
	}), { name: 'headerStore' }
))
