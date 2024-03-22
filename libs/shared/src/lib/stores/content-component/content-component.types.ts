import { IAPIHALResponse, IAPIPagination, IPageParameters } from "../../types/paging.types";
import { FIELD_KEYS, IField } from "../content-type";

export interface IContentComponent {
	id?: string;
	name?: string;
	slug?: string;
	internal?: boolean;
	componentName: FIELD_KEYS;
	configurationFields: IField[];
	fields: IField[];
	createdAt?: string;
	updatedAt?: string;
}

interface IFetchContentComponentsParams extends IPageParameters {
	includeInternal?: boolean;
	includeHidden?: boolean
}

export type IContentComponentsResponse = IAPIHALResponse<'contentComponents', IContentComponent>

export interface IContentComponentStoreState {
	fetchContentComponents: (
		siteId: string, 
		params: IFetchContentComponentsParams
	) => Promise<void>;
	contentComponents: IContentComponent[];
	contentComponentsPagination?: IAPIPagination;
	contentComponentsLoading: boolean;

	fetchContentComponent: (siteId: string, contentComponentId: string) => Promise<IContentComponent>;
	contentComponent?: IContentComponent,
	contentComponentLoading: boolean;

	createContentComponent: (siteId: string, contentComponent: IContentComponentCreateDTO) => Promise<IContentComponent>;
	createContentComponentLoading: boolean;

	updateContentComponent: (siteId: string, contentComponentId: string, values: IContentComponentUpdateDTO) => Promise<IContentComponent>;
	updateContentComponentLoading: boolean;

	removeContentComponent: (siteId: string, contentComponentId: string) => Promise<void>;
	removeContentComponentLoading: boolean;
}

export interface IContentComponentCreateDTO {
	name: string;
	description?: string;
	componentName: FIELD_KEYS;
}

export interface IContentComponentUpdateDTO {
	name: string;
	description?: string;
}

