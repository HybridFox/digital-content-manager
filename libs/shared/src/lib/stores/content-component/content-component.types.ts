import { IAPIHALResponse, IGenericPageOptions } from "../../types/paging.types";
import { FIELD_KEYS, IField } from "../content-type";

export interface IContentComponent {
	id: string;
	name: string;
	slug: string;
	componentName: FIELD_KEYS;
	configurationFields: IField[];
	fields: IField[];
	createdAt: string;
	updatedAt: string;
}

export type IContentComponentsResponse = IAPIHALResponse<'contentComponents', IContentComponent>

export interface IContentComponentStoreState {
	fetchContentComponents: (
		props: IGenericPageOptions & { includeInternal?: boolean; includeHidden?: boolean }
	) => Promise<void>;
	contentComponents: IContentComponent[];
	contentComponentsLoading: boolean;

	fetchContentComponent: (contentComponentId: string) => Promise<IContentComponent>;
	contentComponent?: IContentComponent,
	contentComponentLoading: boolean;

	createContentComponent: (contentComponent: IContentComponentCreateDTO) => Promise<IContentComponent>;
	createContentComponentLoading: boolean;

	updateContentComponent: (contentComponentId: string, values: IContentComponentUpdateDTO) => Promise<IContentComponent>;
	updateContentComponentLoading: boolean;
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

