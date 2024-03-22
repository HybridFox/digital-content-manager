import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';

import { IFieldBlock, IFieldBlockStoreState, IFieldBlocksResponse } from './field-block.types';

export const useFieldBlockStore = create<IFieldBlockStoreState>()(devtools(
	(set) => ({
		fetchFields: async (siteId, contentTypeId, fieldId, params) => {
			set(() => ({ fieldsLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}/fields/${fieldId}/blocks`, {
				searchParams: {
					...params
				}
			}).json<IFieldBlocksResponse>());

			if (error) {
				return set(() => ({ fields: [], fieldsLoading: false }))
			}
			
			set(() => ({ fields: result._embedded.blocks, fieldsLoading: false }));
		},
		fields: [],
		fieldsLoading: false,

		fetchField: async (siteId, contentTypeId, fieldId, blockId) => {
			set(() => ({ fieldLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}/fields/${fieldId}/blocks/${blockId}`).json<IFieldBlock>());

			if (error) {
				set(() => ({ field: undefined, fieldLoading: false }));
				throw error;
			}
			
			set(() => ({ field: result, fieldLoading: false }));
		},
		field: undefined,
		fieldLoading: false,

		createField: async (siteId, contentTypeId, fieldId, block) => {
			set(() => ({ createFieldLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}/fields/${fieldId}/blocks`, {
				json: block,
			}).json<IFieldBlock>());

			if (error) {
				set(() => ({ createFieldLoading: false }));
				throw error;
			}
			
			set(({ fields }) => ({ createFieldLoading: false, fields: [...fields, result] }));
			return result;
		},
		createFieldLoading: false,

		updateField: async (siteId, contentTypeId, fieldId, blockId, block) => {
			set(() => ({ updateFieldLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}/fields/${fieldId}/blocks/${blockId}`, {
				json: block,
			}).json<IFieldBlock>());

			if (error) {
				set(() => ({ updateFieldLoading: false }));
				throw error;
			}
			
			set(() => ({ updateFieldLoading: false, field: result }));
			return result;
		},
		updateFieldLoading: false,

		deleteField: async (siteId, contentTypeId, fieldId, blockId) => {
			set(() => ({ deleteFieldLoading: true }));
			const [, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}/fields/${fieldId}/blocks/${blockId}`));

			if (error) {
				set(() => ({ deleteFieldLoading: false }));
				throw error;
			}
			
			set(({ fields }) => ({ deleteFieldLoading: false, fields: fields.filter((field) => field.id === fieldId) }));
			return;
		},
		deleteFieldLoading: false
	}), { name: 'fieldBlockStore' }
))
