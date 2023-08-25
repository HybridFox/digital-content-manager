import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services';
import { DEFAULT_PAGINATION_OPTIONS } from '../../const';

import { IContentRevision, IContentRevisionStoreState, IContentRevisionsResponse } from './content-revision.types';

export const useContentRevisionStore = create<IContentRevisionStoreState>()(devtools(
	(set) => ({
		fetchContentRevisions: async (siteId, contentId, searchParams) => {
			set(() => ({ contentRevisionsLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content/${contentId}/revisions`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<IContentRevisionsResponse>());

			if (error) {
				return set(() => ({ contentRevisions: [], contentRevisionsLoading: false }))
			}
			
			set(() => ({ contentRevisions: result._embedded.contentRevisions, contentRevisionsPagination: result._page, contentRevisionsLoading: false }));
		},
		contentRevisions: [],
		contentRevisionsLoading: false,

		fetchContentRevision: async (siteId, contentId, revisionId) => {
			set(() => ({ contentRevisionLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content/${contentId}/revisions/${revisionId}`).json<IContentRevision>());

			if (error) {
				return set(() => ({ contentRevision: undefined, contentRevisionLoading: false }))
			}
			
			set(() => ({ contentRevision: result, contentRevisionLoading: false }));
		},
		contentRevisionLoading: false,

		fetchContentRevisionComparison: async (siteId, contentId, firstRevisionId, secondRevisionId) => {
			set(() => ({ contentRevisionLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content/${contentId}/revisions/${firstRevisionId}/compare/${secondRevisionId}`).json<[IContentRevision, IContentRevision]>());

			if (error) {
				return set(() => ({ contentRevision: undefined, contentRevisionLoading: false }))
			}
			
			set(() => ({ contentRevisionComparison: result, contentRevisionComparisonLoading: false }));
		},
		contentRevisionComparisonLoading: false,
	}), { name: 'contentRevisionStore' }
))
