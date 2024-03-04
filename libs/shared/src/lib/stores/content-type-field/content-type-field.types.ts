import { IAPIHALResponse } from "../../types/paging.types";
import { IContentComponent } from "../content-component";

export interface IContentTypeField {
	id: string;
	name: string;
	slug: string;
	contentComponent: IContentComponent;
	min: number;
	max: number;
	multiLanguage: boolean;
	config: Record<string, string>
}

export type IContentTypeFieldsResponse = IAPIHALResponse<'fields', IContentTypeField>

export interface IContentTypeFieldStoreState {
	fetchFields: (siteId: string, contentTypeId: string) => Promise<void>;
	fields: IContentTypeField[];
	fieldsLoading: boolean;

	fetchField: (siteId: string, contentTypeId: string, fieldId: string) => Promise<void>;
	field?: IContentTypeField,
	fieldLoading: boolean;

	createField: (siteId: string, contentTypeId: string, field: IContentTypeFieldCreateDTO) => Promise<IContentTypeField>;
	createFieldLoading: boolean;

	updateField: (siteId: string, contentTypeId: string, fieldId: string, field: IContentTypeFieldUpdateDTO) => Promise<IContentTypeField>;
	updateFieldLoading: boolean;

	deleteField: (siteId: string, contentTypeId: string, fieldId: string) => Promise<void>;
	deleteFieldLoading: boolean;

	updateFieldOrder: (siteId: string, contentTypeId: string, fieldIds: string[]) => Promise<void>;
	updateFieldOrderLoading: boolean;
}

export interface IContentTypeFieldCreateDTO {
	name: string;
	contentComponentId: string;
}

export interface IContentTypeFieldUpdateDTO {
	name: string;
}
