import { IAPIHALResponse, IPageParameters } from "../../types/paging.types";

export interface ICompartment {
	id: string;
	name: string;
	description?: string;
}

export type ICompartmentsResponse = IAPIHALResponse<'compartments', ICompartment>

export interface ICompartmentStoreState {
	fetchCompartments: (siteId: string, contentTypeId: string, params: IPageParameters) => Promise<void>;
	compartments: ICompartment[];
	compartmentsLoading: boolean;

	fetchCompartment: (siteId: string, contentTypeId: string, compartmentId: string) => Promise<void>;
	compartment?: ICompartment,
	compartmentLoading: boolean;

	createCompartment: (siteId: string, contentTypeId: string, compartment: ICompartmentCreateDTO) => Promise<ICompartment>;
	createCompartmentLoading: boolean;

	updateCompartment: (siteId: string, contentTypeId: string, compartmentId: string, compartment: ICompartmentUpdateDTO) => Promise<ICompartment>;
	updateCompartmentLoading: boolean;

	deleteCompartment: (siteId: string, contentTypeId: string, compartmentId: string) => Promise<void>;
	deleteCompartmentLoading: boolean;
}

export interface ICompartmentCreateDTO {
	name: string;
}

export interface ICompartmentUpdateDTO {
	name: string;
	description?: string;
}
