import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';
import { useAuthStore } from '../auth';

import { IContentComponentField, IContentComponentFieldStoreState, IContentComponentFieldsResponse } from './content-component-field.types';

export const useContentComponentFieldStore = create<IContentComponentFieldStoreState>()(devtools(
	(set) => ({
		fetchFields: async (contentComponentId) => {
			set(() => ({ fieldsLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/content-components/${contentComponentId}/fields`).json<IContentComponentFieldsResponse>());

			if (error) {
				return set(() => ({ fields: [], fieldsLoading: false }))
			}
			
			set(() => ({ fields: result._embedded.fields, fieldsLoading: false }));
		},
		fields: [],
		fieldsLoading: false,

		fetchField: async (contentComponentId, fieldId) => {
			set(() => ({ fieldLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.get(`/api/v1/sites/${activeSite?.id}/content-components/${contentComponentId}/fields/${fieldId}`).json<IContentComponentField>());

			if (error) {
				set(() => ({ field: undefined, fieldLoading: false }));
				throw error;
			}
			
			set(() => ({ field: result, fieldLoading: false }));
		},
		field: undefined,
		fieldLoading: false,

		createField: async (contentComponentId, field) => {
			set(() => ({ createFieldLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.post(`/api/v1/sites/${activeSite?.id}/content-components/${contentComponentId}/fields`, {
				json: field,
			}).json<IContentComponentField>());
			set(() => ({ createFieldLoading: false }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createFieldLoading: false,

		updateField: async (contentComponentId, fieldId, field) => {
			set(() => ({ createFieldLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [result, error] = await wrapApi(kyInstance.put(`/api/v1/sites/${activeSite?.id}/content-components/${contentComponentId}/fields/${fieldId}`, {
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

		deleteField: async (contentComponentId, fieldId) => {
			set(() => ({ deleteFieldLoading: true }));
			const { activeSite } = useAuthStore.getState();
			const [, error] = await wrapApi(kyInstance.delete(`/api/v1/sites/${activeSite?.id}/content-components/${contentComponentId}/fields/${fieldId}`));

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
