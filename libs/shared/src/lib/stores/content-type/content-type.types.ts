import { IAPIHALResponse } from "../../types/paging.types";
import { IContentComponent } from "../content-component";

export interface IContentType {
	id: string;
	name: string;
	slug: string;
	componentName: string;
	createdAt: string;
	updatedAt: string;
	fields: IField[];
}

export interface IField {
	id: string,
	name: string,
	slug: string,
	contentComponent: IContentComponent,
	config: Record<string, string>
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
}

export interface IContentTypeCreateDTO {
	name: string;
	description: string;
}
