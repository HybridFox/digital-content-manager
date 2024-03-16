import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import { kyInstance, wrapApi } from '../../services/ky.instance';

import { ICompartment, ICompartmentStoreState, ICompartmentsResponse } from './compartment.types';

export const useCompartmentStore = create<ICompartmentStoreState>()(devtools(
	(set) => ({
		fetchCompartments: async (siteId, contentTypeId, params) => {
			set(() => ({ compartmentsLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}/compartments`, {
				searchParams: { ...params }
			}).json<ICompartmentsResponse>());

			if (error) {
				return set(() => ({ compartments: [], compartmentsLoading: false }))
			}
			
			set(() => ({ compartments: result._embedded.compartments, compartmentsLoading: false }));
		},
		compartments: [],
		compartmentsLoading: false,

		fetchCompartment: async (siteId, contentTypeId, compartmentId) => {
			set(() => ({ compartmentLoading: true }));
			const [result, error] = await wrapApi(kyInstance.get(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}/compartments/${compartmentId}`).json<ICompartment>());

			if (error) {
				set(() => ({ compartment: undefined, compartmentLoading: false }));
				throw error;
			}
			
			set(() => ({ compartment: result, compartmentLoading: false }));
		},
		compartment: undefined,
		compartmentLoading: false,

		createCompartment: async (siteId, contentTypeId, compartment) => {
			set(() => ({ createCompartmentLoading: true }));
			const [result, error] = await wrapApi(kyInstance.post(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}/compartments`, {
				json: compartment,
			}).json<ICompartment>());
			set(({ compartments }) => ({ createCompartmentLoading: false, compartments: [...compartments, result!] }));

			if (error) {
				throw error;
			}
			
			return result;
		},
		createCompartmentLoading: false,

		updateCompartment: async (siteId, contentTypeId, compartmentId, compartment) => {
			set(() => ({ createCompartmentLoading: true }));
			const [result, error] = await wrapApi(kyInstance.put(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}/compartments/${compartmentId}`, {
				json: compartment,
			}).json<ICompartment>());

			if (error) {
				set(() => ({ updateCompartmentLoading: false }));
				throw error;
			}
			
			set(() => ({ updateCompartmentLoading: false, compartment: result }));
			return result;
		},
		updateCompartmentLoading: false,

		removeCompartment: async (siteId, contentTypeId, compartmentId) => {
			set(() => ({ removeCompartmentLoading: true }));
			const [, error] = await wrapApi(kyInstance.delete(`/admin-api/v1/sites/${siteId}/content-types/${contentTypeId}/compartments/${compartmentId}`));

			if (error) {
				set(() => ({ removeCompartmentLoading: false }));
				throw error;
			}
			
			set(({ compartments }) => ({ removeCompartmentLoading: false, compartments: compartments.filter((compartment) => compartment.id !== compartmentId) }));
			return;
		},
		removeCompartmentLoading: false,
	}), { name: 'compartmentStore' }
))
