import { IAPIHALResponse } from "../../types/paging.types";
import { IContentComponent } from "../content-component";

export interface IContentTypeField {
	id: string,
	name: string,
	slug: string,
	contentComponent: IContentComponent,
	config: Record<string, string>
}

export type IContentTypeFieldsResponse = IAPIHALResponse<'fields', IContentTypeField>

export interface IContentTypeFieldStoreState {
	fetchFields: (contentTypeId: string) => Promise<void>;
	fields: IContentTypeField[];
	fieldsLoading: boolean;

	fetchField: (contentTypeId: string, fieldId: string) => Promise<void>;
	field?: IContentTypeField,
	fieldLoading: boolean;

	createField: (contentTypeId: string, field: IContentTypeFieldCreateDTO) => Promise<IContentTypeField>;
	createFieldLoading: boolean;
}

export interface IContentTypeFieldCreateDTO {
	name: string;
	contentComponentId: string;
}
