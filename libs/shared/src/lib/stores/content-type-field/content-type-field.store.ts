import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';

import { IContentTypeField, IContentTypeFieldStoreState, IContentTypeFieldsResponse } from './content-type-field.types';

export const useContentTypeFieldStore = create<IContentTypeFieldStoreState>()(devtools(
	(set) => ({
		fetchFields: async (siteId, contentTypeId) => {
			set(() => ({ fieldsLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${siteId}/content-types/${contentTypeId}/fields`).json<IContentTypeFieldsResponse>());

			if (error) {
				return set(() => ({ fields: [], fieldsLoading: false }))
			}
			
			set(() => ({ fields: result._embedded.fields, fieldsLoading: false }));
		},
		fields: [],
		fieldsLoading: false,

		fetchField: async (siteId, contentTypeId, fieldId) => {
			set(() => ({ fieldLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${siteId}/content-types/${contentTypeId}/fields/${fieldId}`).json<IContentTypeField>());

			if (error) {
				set(() => ({ field: undefined, fieldLoading: false }));
				throw error;
			}
			
			set(() => ({ field: result, fieldLoading: false }));
		},
		field: undefined,
		fieldLoading: false,

		createField: async (siteId, contentTypeId, field) => {
			set(() => ({ createFieldLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${siteId}/content-types/${contentTypeId}/fields`, {
				json: field,
			}).json<IContentTypeField>());
			set(() => ({ createFieldLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createFieldLoading: false,

		updateField: async (siteId, contentTypeId, fieldId, field) => {
			set(() => ({ createFieldLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${siteId}/content-types/${contentTypeId}/fields/${fieldId}`, {
				json: field,
			}).json<IContentTypeField>());

			if (error) {
				set(() => ({ updateFieldLoading: false }));
				throw error;
			}
			
			set(() => ({ updateFieldLoading: false, field: result }));
			return result;
		},
		updateFieldLoading: false,

		deleteField: async (siteId, contentTypeId, fieldId) => {
			set(() => ({ deleteFieldLoading: true }));
			const [, error] = await wrapApi(kyInstance.delete(`/api/v1/sites/${siteId}/content-types/${contentTypeId}/fields/${fieldId}`));

			if (error) {
				set(() => ({ deleteFieldLoading: false }));
				throw error;
			}
			
			set(({ fields }) => ({ deleteFieldLoading: false, fields: fields.filter((field) => field.id === fieldId) }));
			return;
		},
		deleteFieldLoading: false,
	}), { name: 'fieldStore' }
))
