import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { DEFAULT_PAGINATION_OPTIONS, ISite, kyInstance, wrapApi } from '@ibs/shared';

import { ISiteStoreState, ISitesResponse } from './site.types';

export const useSiteStore = create<ISiteStoreState>()(devtools(
	(set) => ({
		fetchSites: async (searchParams) => {
			set(() => ({ sitesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<ISitesResponse>());

			if (error) {
				return set(() => ({ sites: [], sitesLoading: false }))
			}
			
			set(() => ({ sites: result._embedded.sites, sitesLoading: false }));
		},
		sites: [],
		sitesLoading: false,

		fetchSite: async (siteId) => {
			set(() => ({ siteLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${siteId}`).json<ISite>());

			if (error) {
				set(() => ({ site: undefined, siteLoading: false }));
				throw error;
			}
			
			set(() => ({ site: result, siteLoading: false }));
		},
		site: undefined,
		siteLoading: false,

		createSite: async (site) => {
			set(() => ({ createSiteLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites`, {
				json: site,
			}).json<ISite>());
			set(() => ({ createSiteLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createSiteLoading: false,

		updateSite: async (siteId, data) => {
			set(() => ({ updateSiteLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${siteId}`, {
				json: data,
			}).json<ISite>());

			if (error) {
				set(() => ({ updateSiteLoading: false }));
				throw error;
			}
			
			set(() => ({ workflow: result, updateSiteLoading: false }));
			return result;
		},
		updateSiteLoading: false,

		removeSite: async (siteId) => {
			set(() => ({ removeSiteLoading: true }));
			const [result, error] = await wrapApi(kyInstance.delete(`/api/v1/sites/${siteId}`).json<void>());

			if (error) {
				set(() => ({ removeSiteLoading: false }));
				throw error;
			}
			
			set(() => ({ removeSiteLoading: false }));
			return result;
		},
		removeSiteLoading: false,
	}), { name: 'siteStore' }
))
