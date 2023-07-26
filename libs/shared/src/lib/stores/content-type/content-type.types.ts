import { IAPIHALResponse } from "../../types/paging.types";
import { IContentComponent } from "../content-component";

export enum FIELD_KEYS {
	FIELD_GROUP = 'FIELD_GROUP',
	TEXT = 'TEXT',
	NUMBER = 'NUMBER',
	TEXTAREA = 'TEXTAREA',
	RICH_TEXT = 'RICH_TEXT',
	URL = 'URL',
	SELECT = 'SELECT',
	RADIO = 'RADIO',
	CHECKBOX = 'CHECKBOX',
	MAP = 'MAP',
	MEDIA = 'MEDIA',
	TOGGLE = 'TOGGLE',
	REFERENCE = 'REFERENCE',
};

export interface IContentType {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	fields: IField[];
}

export interface IField {
	id: string;
	name: string;
	slug: string;
	min: number;
	max: number;
	contentComponent: IContentComponent;
	config: Record<string, string>;
}

export type IContentTypesResponse = IAPIHALResponse<'contentTypes', IContentType>

export interface IContentTypeStoreState {
	fetchContentTypes: () => Promise<void>;
	contentTypes: IContentType[];
	contentTypesLoading: boolean;

	fetchContentType: (contentTypeId: string) => Promise<void>;
	contentType?: IContentType,
	contentTypeLoading: boolean;

	createContentType: (contentType: IContentTypeCreateDTO) => Promise<IContentType>;
	createContentTypeLoading: boolean;

	updateContentType: (contentTypeId: string, values: IContentTypeUpdateDTO) => Promise<IContentType>;
	updateContentTypeLoading: boolean;
}

export interface IContentTypeCreateDTO {
	name: string;
	description?: string;
}

export interface IContentTypeUpdateDTO {
	name: string;
	description?: string;
}
