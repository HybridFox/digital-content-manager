import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';

import { IContentComponentField, IContentComponentFieldStoreState, IContentComponentFieldsResponse } from './content-component-field.types';

export const useContentComponentFieldStore = create<IContentComponentFieldStoreState>()(devtools(
	(set) => ({
		fetchFields: async (siteId, contentComponentId) => {
			set(() => ({ fieldsLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content-components/${contentComponentId}/fields`).json<IContentComponentFieldsResponse>());

			if (error) {
				return set(() => ({ fields: [], fieldsLoading: false }))
			}
			
			set(() => ({ fields: result._embedded.fields, fieldsLoading: false }));
		},
		fields: [],
		fieldsLoading: false,

		fetchField: async (siteId, contentComponentId, fieldId) => {
			set(() => ({ fieldLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content-components/${contentComponentId}/fields/${fieldId}`).json<IContentComponentField>());

			if (error) {
				set(() => ({ field: undefined, fieldLoading: false }));
				throw error;
			}
			
			set(() => ({ field: result, fieldLoading: false }));
		},
		field: undefined,
		fieldLoading: false,

		createField: async (siteId, contentComponentId, field) => {
			set(() => ({ createFieldLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/sites/${siteId}/content-components/${contentComponentId}/fields`, {
				json: field,
			}).json<IContentComponentField>());
			set(() => ({ createFieldLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createFieldLoading: false,

		updateField: async (siteId, contentComponentId, fieldId, field) => {
			set(() => ({ createFieldLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/sites/${siteId}/content-components/${contentComponentId}/fields/${fieldId}`, {
				json: field,
			}).json<IContentComponentField>());

			if (error) {
				set(() => ({ updateFieldLoading: false }));
				throw error;
			}
			
			set(() => ({ updateFieldLoading: false, field: result }));
			return result;
		},
		updateFieldLoading: false,

		deleteField: async (siteId, contentComponentId, fieldId) => {
			set(() => ({ deleteFieldLoading: true }));
			const [, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/sites/${siteId}/content-components/${contentComponentId}/fields/${fieldId}`));

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
