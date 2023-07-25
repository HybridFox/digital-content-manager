import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';
import { useAuthStore } from '../auth';

import { IContentTypeField, IContentTypeFieldStoreState, IContentTypeFieldsResponse } from './content-type-field.types';

export const useContentTypeFieldStore = create<IContentTypeFieldStoreState>()(devtools(
	(set) => ({
		fetchFields: async (contentTypeId) => {
			set(() => ({ fieldsLoading: true }));
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${selectedSiteId}/content-types/${contentTypeId}/fields`).json<IContentTypeFieldsResponse>());

			if (error) {
				return set(() => ({ fields: [], fieldsLoading: false }))
			}
			
			set(() => ({ fields: result._embedded.fields, fieldsLoading: false }));
		},
		fields: [],
		fieldsLoading: false,

		fetchField: async (contentTypeId, fieldId) => {
			set(() => ({ fieldLoading: true }));
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${selectedSiteId}/content-types/${contentTypeId}/fields/${fieldId}`).json<IContentTypeField>());

			if (error) {
				set(() => ({ field: undefined, fieldLoading: false }));
				throw error;
			}
			
			set(() => ({ field: result, fieldLoading: false }));
		},
		field: undefined,
		fieldLoading: false,

		createField: async (contentTypeId, field) => {
			set(() => ({ createFieldLoading: true }));
			const { selectedSiteId } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${selectedSiteId}/content-types/${contentTypeId}/fields`, {
				json: field,
			}).json<IContentTypeField>());
			set(() => ({ createFieldLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createFieldLoading: false,
	}), { name: 'fieldStore' }
))