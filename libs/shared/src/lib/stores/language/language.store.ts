import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services';
import { DEFAULT_PAGINATION_OPTIONS } from '../../const';
import { ILanguage } from '../../types';

import { ILanguageStoreState, ILanguagesResponse } from './language.types';

export const useLanguageStore = create<ILanguageStoreState>()(devtools(
	(set) => ({
		fetchLanguages: async (searchParams) => {
			set(() => ({ languagesLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/languages`, {
				searchParams: {
					...DEFAULT_PAGINATION_OPTIONS,
					...searchParams,
				}
			}).json<ILanguagesResponse>());

			if (error) {
				return set(() => ({ languages: [], languagesLoading: false }))
			}
			
			set(() => ({ languages: result._embedded.languages, languagesLoading: false }));
		},
		languages: [],
		languagesLoading: false,

		fetchLanguage: async (languageId) => {
			set(() => ({ languageLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/languages/${languageId}`).json<ILanguage>());

			if (error) {
				set(() => ({ language: undefined, languageLoading: false }));
				throw error;
			}
			
			set(() => ({ language: result, languageLoading: false }));
		},
		language: undefined,
		languageLoading: false,
	}), { name: 'languageStore' }
))
